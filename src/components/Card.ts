import { IProductItem, TCardBasket, TCardItem } from '../types';
import { Component } from './base/Component';
import { IEvents } from './base/events';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProductItem> {
	protected events: IEvents;
	protected cardImage: HTMLImageElement;
	protected cardTitle: HTMLElement;
	protected cardCategory: HTMLElement;
	protected cardPrice: HTMLElement;
	protected cardId: string;
	protected cardCategoryColor = <Record<string, string>>{
		'софт-скил': 'soft',
		другое: 'other',
		дополнительное: 'additional',
		кнопка: 'button',
		'хард-скил': 'hard',
	};

	constructor(
		protected container: HTMLElement,
		events: IEvents,
		actions?: ICardActions
	) {
		super(container);
		this.events = events;

		this.cardImage = this.container.querySelector('.card__image');
		this.cardTitle = this.container.querySelector('.card__title');
		this.cardCategory = this.container.querySelector('.card__category');
		this.cardPrice = this.container.querySelector('.card__price');
        this.cardId = this.container.getAttribute('data-id');

        if (actions?.onClick) {
			container.addEventListener('click', actions.onClick);
		}
	}

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this.cardTitle, value);
    }

    get title(): string {
        return this.cardTitle.textContent || '';
    }

    set image(value: string) { 
        this.setImage(this.cardImage, value, this.title);
}

    set category(value: string) {
        this.setText(this.cardCategory, value);
    }

    set categoryColor(value: string) {
        this.cardCategory.classList.add(this.cardCategoryColor[value]);
    }

    set price(value: number | null) {
        if (value !== null) {
            this.cardPrice.textContent = `${value} синапсов`;
        } else {
            this.cardPrice.textContent = 'Бесценно';
        }
    }
}

export class CardPreview extends Component<TCardItem> {
    protected cardDescription: HTMLElement;
    protected cardButton?: HTMLButtonElement;
    protected events: IEvents;
    constructor(
        container: HTMLElement,
        events: IEvents,
        actions?: ICardActions
    ) {
        super(container);
        this.events = events;

        this.cardDescription = this.container.querySelector('.card__description');
        this.cardButton = this.container.querySelector('.card__button');

		if (actions?.onClick) {
            if (this.cardButton) {
                this.cardButton.addEventListener('click', actions?.onClick);
            } else {
                container.addEventListener('click', actions?.onClick);
            }
		}
	}

    set description(value: string) {
        if (value) {
            this.setText(this.cardDescription, value);
        } else {
            this.cardDescription.textContent = '';
        }
    }
    set button(value: string) {
        if (value === 'toBasket') {
            this.cardButton.textContent = 'Добавить в корзину';
        } else {
            this.container.textContent = 'Удалить из корзины';
        }
        if (this.cardButton) {
            if (value === null) {
                this.cardButton.disabled = true;
            } else {
                this.cardButton.disabled = false;
            }
        }
    }

    set disabled(value: boolean) {
        if (this.cardButton) {
            this.cardButton.disabled = value;
        }
    }

    }

    export class CardBasket extends Component<TCardBasket> {
        protected events: IEvents;
        protected cardTitle: HTMLElement;
        protected cardPrice: HTMLElement;

        constructor(
            container: HTMLElement,
            events: IEvents,
            actions?: ICardActions
        ) {
            super(container);
            this.events = events;

            this.cardTitle = this.container.querySelector('.card__title');
            this.cardPrice = this.container.querySelector('.card__price');

            if (actions?.onClick) {
                container.addEventListener('click', actions?.onClick);
            }
        }

        set title(value: string) {
            this.setText(this.cardTitle, value);
        }

        set price(value: number | null) {
            if (value !== null) {
                this.cardPrice.textContent = `${value} синапсов`;
            } else {
                this.cardPrice.textContent = 'Бесценно';
            }
        }

    }
