import { FormErrors, ICardData, IOrderForm, IProductItem } from '../types/index';
import { IOrder } from "../types/index";
import { IEvents } from './base/events';
import { Model } from "./base/Model";

export class CardData extends Model<ICardData> {
	catalog: IProductItem[];
	preview: string;
	basket: IProductItem[] = [];
	order: IOrder = {
		total: 0,
		items: [],
		payment: 'cash/card',
		address: '',
		email: '',
		phone: '',
	};
	protected events: IEvents;
	formErrors: FormErrors = {};

	setCatalog(products: IProductItem[]) {
		this.catalog = products
		this.events.emit('cards:changed')
	}

	setPreview(product: IProductItem) {
		this.preview = product.id;
		this.events.emit('card-preview:changed', product);
	}

	setProductToBasket(product: IProductItem) {
		this.basket.push(product)
		this.events.emit('basket:changed');
	}

	setTotal(value: number) {
		this.order.total = value;
	}

	getTotal() {
		return this.order.items.reduce(
			(total, item) =>
				total + this.catalog.find((product) => product.id === item).price,
			0
		);
	}

	getBasket(): IProductItem[] {
		return this.basket
	}

	getStatusBasket(): boolean {
		return this.basket.length === 0
	}

	addProductToBasket(product: IProductItem) {
		this.order.items.push(product.id)
		this.events.emit('basket:changed');
	}

	removeProductFromBasket(product: IProductItem) {
		const count = this.order.items.indexOf(product.id);
		if (count !== -1) {
			this.order.items.splice(count, 1);
			this.events.emit('basket:changed');
		}
	}

	removeProductPriceBasket(product: IProductItem) {
		const count = this.basket.indexOf(product);
		if (count !== -1) {
			this.basket.splice(count, 1);
			this.events.emit('basket:changed');
		}
	}

	clearCountBasket() {
		this.basket = [];
		this.order.items = [];
	}

	setOrderAddress(item: keyof IOrderForm, value: string) {
		this.order[item] = value;
		if (this.validationOrder()) {
			this.events.emit(`order:ready`, this.order);
		}
	}

	setOrderContacts(item: keyof IOrderForm, value: string) {
		this.order[item] = value;
		if (this.validationOrder()) {
			this.events.emit(`order:ready`, this.order);
		}
	}

	validationOrder() {
		const err: typeof this.formErrors = {};
		const addressPattern = /^[A-Za-zА-Яа-я0-9\s,.-]{10,}$/;
		const emailPattern = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
		const phonePattern = /[\+]\d{1}\s[\(]\d{3}[\)]\s\d{3}[\-]\d{2}[\-]\d{2}/;

		if (!this.order.address) {
			err.address = 'Укажите адрес';
		} else if (!addressPattern.test(this.order.address)) {
			err.address = 'Поле должно содержать не менее 10 символов';
		}

		if (!this.order.email) {
			err.email = 'Укажите почту';
		} else if (!emailPattern.test(this.order.email)) {
			err.email = 'Некорректный формат email';
		}

		if (!this.order.phone) {
			err.phone = 'Укажите номер телефона';
		} else if (!phonePattern.test(this.order.phone)) {
			err.phone =
				'Телефон должен содержать только цифры, в формате +7 (ХХХ) ХХХ-ХХ-ХХ';
		}

		this.formErrors = err;
		this.events.emit('formError:changed', this.formErrors);
		return Object.keys(err).length === 0;
	}
}
