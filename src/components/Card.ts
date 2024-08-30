import { ICardBasket, IProductItem } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProductItem> {
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

	constructor(protected container: HTMLElement, actions?: ICardActions) {
		super(container);

		this.cardImage = this.container.querySelector('.card__image');
		this.cardTitle = this.container.querySelector('.card__title');
		this.cardCategory = this.container.querySelector('.card__category');
		this.cardPrice = this.container.querySelector('.card__price');
		this.cardId = this.container.getAttribute('data-id');

		if (actions?.onClick) {
			container.addEventListener('click', actions.onClick);
		}
	}

	set title(title: string) {
		this.setText(this.cardTitle, title);
	}

	set category(category: string) {
		this.setText(this.cardCategory, category);
		this.cardCategory.className = `card__category card__category_${this.cardCategoryColor[category]}`;
	}

	set image(image: string) {
		this.setImage(this.cardImage, image, this.title);
	}
	set price(value: number | null) {
		if (value !== null) {
			this.cardPrice.textContent = `${value} синапсов`;
		} else {
			this.cardPrice.textContent = 'Бесценно';
		}
	}
}

export class CardPreview extends Card {
	protected cardDescription: HTMLElement;
	protected cardButton?: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this.cardDescription = this.container.querySelector('.card__description');
		this.cardButton = this.container.querySelector('.card__button');

		if (actions?.onClick) {
			if (this.cardButton) {
				container.removeEventListener('click', actions.onClick);
				this.cardButton.addEventListener('click', actions.onClick);
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

	set disabled(value: boolean) {
		if (this.cardButton) {
			this.cardButton.disabled = value;
		}
	}
}

export class CardBasket extends Component<ICardBasket> {
	protected cardIndex: HTMLElement;
	protected cardTitle: HTMLElement;
	protected cardPrice: HTMLElement;
	protected cardButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this.cardTitle = ensureElement<HTMLElement>(`.card__title`, container);
		this.cardPrice = ensureElement<HTMLElement>(`.card__price`, container);
		this.cardIndex = ensureElement<HTMLElement>(
			`.basket__item-index`,
			container
		);
		this.cardButton = ensureElement<HTMLButtonElement>(
			'.card__button',
			container
		);

		if (actions?.onClick) {
			if (this.cardButton) {
				container.removeEventListener('click', actions.onClick);
				this.cardButton.addEventListener('click', actions.onClick);
			}
		}
	}

	set index(value: number) {
		this.setText(this.cardIndex, value);
	}

	set title(value: string) {
		this.setText(this.cardIndex, value);
	}

	set price(value: number) {
		if (value === null) {
			this.setText(this.cardPrice, `Бесценно`);
		}
		this.setText(this.cardPrice, `${value} синапсов`);
	}
}
