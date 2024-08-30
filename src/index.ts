import './scss/styles.scss';

import { CardData } from './components/CardsData';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Card, CardBasket, CardPreview } from './components/Card';
import { CatalogChangeEvent, IOrderForm, IProductItem } from './types';
import { OrderAddress, OrderContacts } from './components/Order';
import { Success } from './components/common/Success';
import { AppAPI } from './components/AppAPI';

// Модель данных приложения
const events = new EventEmitter();
const api = new AppAPI(CDN_URL, API_URL);
const cardsData = new CardData({}, events);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Все шаблоны
const cardSuccessTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderAddress = new OrderAddress(
	cloneTemplate<HTMLFormElement>(orderTemplate),
	events
);
const orderContacts = new OrderContacts(
	cloneTemplate<HTMLFormElement>(contactsTemplate),
	events
);
const success = new Success(
	cloneTemplate<HTMLFormElement>(cardSuccessTemplate),
	events
);

// Дальше идет бизнес-логика
// Изменились элементы каталога
events.on<CatalogChangeEvent>('cards:changed', () => {
	page.catalog = cardsData.catalog.map((card) => {
		const cardInstant = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', card),
		});
		return cardInstant.render({
			id: card.id,
			title: card.title,
			image: api.ind + card.image,
			category: card.category,
			price: card.price,
		});
	});
});

//Открылась карточка
events.on('card:select', (card: IProductItem) => {
	cardsData.setPreview(card);
});

events.on('card-preview:changed', (card: IProductItem) => {
	const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:addToBasket', card);
		},
	});

	modal.render({
		content: cardPreview.render({
			id: card.id,
			title: card.title,
			image: api.ind + card.image,
			category: card.category,
			price: card.price,
			description: card.description,
		}),
	});

	if (card.price === null) {
		cardPreview.disabled = true;
	}
});

//Добавлена карточка в корзину
events.on('card:addToBasket', (card: IProductItem) => {
	cardsData.addProductToBasket(card);
	cardsData.setProductToBasket(card);
	events.emit('basket:change');
	modal.close();
});

//Открылась корзина
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

//Удалена карточка из корзины
events.on('basket:delete', (card: IProductItem) => {
	cardsData.removeProductFromBasket(card);
	cardsData.removeProductPriceBasket(card);
	events.emit('basket:change');
});

//Изменилась сумма в корзине
events.on('basket:change', () => {
	basket.setDisabled(basket.basketButton, cardsData.getStatusBasket());
	page.counter = cardsData.basket.length;
	basket.total = cardsData.getTotal();
	let count = 1;
	basket.items = cardsData.basket.map((card) => {
		const cardBasked = new CardBasket(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('basket:delete', card);
			},
		});
		return cardBasked.render({
			title: card.title,
			price: card.price,
			index: count++,
		});
	});
	basket.render();
});

//Валидация формы по кнопке
events.on('formError:changed', (errors: Partial<IOrderForm>) => {
	const { email, phone, address, payment } = errors;
	orderAddress.valid = !address && !payment;
	orderContacts.valid = !email && !phone;
	orderAddress.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
	orderContacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей контактов
events.on(
	/^contacts\..*/,
	(data: { field: keyof IOrderForm; value: string }) => {
		cardsData.setOrderContacts(data.field, data.value);
	}
);

// Изменилось поле адреса
events.on(/^order\..*/, (data: { field: keyof IOrderForm; value: string }) => {
	cardsData.setOrderAddress(data.field, data.value);
});

// Изменился способ оплаты
events.on('payment:change', (item: HTMLButtonElement) => {
	cardsData.order.payment = item.name;
});

// Открыть первую форму заказа
events.on('order:open', () => {
	modal.render({
		content: orderAddress.render({
			address: '',
			payment: 'card',
			valid: false,
			errors: [],
		}),
	});
});

// Открыть вторую форму заказа
events.on('order:submit', () => {
	cardsData.order.total = cardsData.getTotal();
	modal.render({
		content: orderContacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

//Отплатить заказ
events.on('contacts:submit', () => {
	api.orderProducts(cardsData.order).then((result) => {
		modal.render({
			content: success.render({
				total: cardsData.getTotal(),
			}),
		});
		cardsData.clearCountBasket();
		events.emit('basket:change');
	});
});

//Закрываем форму после успешногшо заказа
events.on('order:completed', () => {
	modal.close();
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем товары с сервера
api
	.getProductList()
	.then(cardsData.setCatalog.bind(cardsData))
	.catch((err) => {
		console.error(err);
	});
