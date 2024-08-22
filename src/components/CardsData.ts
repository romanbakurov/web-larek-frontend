import { IProductItem, FormErrors, IOrderForm, ICardData } from '../types';
import { IEvents } from './base/events';

export class CardData implements ICardData {
	catalog: IProductItem[];
	preview: string | null;
	basket: IProductItem[];
    total: string | number;
	order: IOrderForm = {
		total: 0,
		items: [],
		payment: 'cash/card',
		address: '',
		email: '',
		phone: ''
	};
	protected events: IEvents;
	formErrors: FormErrors = {};


	constructor(events: IEvents) {
		this.events = events;
	}


	setCatalog(catalog: IProductItem[]) {
		this.catalog = catalog;
		this.events.emit('catalog:changed');
	}

	getCatalog(productId: string) {
		return this.catalog.find((product) => product.id === productId)
	}

	setPreview(product: IProductItem) {
		this.preview = product.id;
		this.events.emit('card-preview:changed');
	}

	setProductToBasket(product: IProductItem) {
		this.basket.push(product);
		this.events.emit('basket:changed');
	}

	setTotal(value: number) {
		this.order.total = value;
	}

	getTotal() {
		return this.order.items.reduce((total, item) => total + this.catalog.find((product) => product.id === item).price, 0);
	}

    getBasket(): IProductItem[] {
		return this.basket
	}

	getStatusBasket(): boolean {
		return this.basket.length === 0;
	}

    addProductToBasket(product: IProductItem) {
        this.order.items.push(product.id);
        this.events.emit('basket:changed');
    }

    deleteProductFromBasket(productId: string, payload: Function | null) {
        this.catalog = this.catalog.filter(product => product.id !== productId);

        if(payload) {
            payload()
        } else {
            this.events.emit('basket:changed');
        }
    }

    updateBasket(product: IProductItem, payload: Function | null) {
        const foundCard = this.catalog.find((item) => item.id === product.id)
        if(!foundCard)this.setProductToBasket(product);

        Object.assign(foundCard as IProductItem, product);

        if(payload) {
            payload()
        } else {
            this.events.emit('basket:changed');
        }
    }

    setOrder(item: keyof IOrderForm, value: string) {
        (this.order[item] as string) = value;
		if (this.validationOrder()) {
			this.events.emit(`order:ready`, this.order);
		}
    }

    validationOrder() {
		const err: typeof this.formErrors = {};
        const addressPattern = /^[A-Za-zА-Яа-я0-9\s,.-]{10,}$/;
        const emailPattern = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        const phonePattern = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;

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
            err.phone = 'Телефон должен содержать только цифры, в формате +7(ХХХ)ХХХ-ХХ-ХХ';
        }

		this.formErrors = err;
		this.events.emit('formError:changed', err)
		return Object.keys(err).length === 0
	}
}
