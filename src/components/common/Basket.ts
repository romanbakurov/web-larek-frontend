import { Component } from '../base/Component';
import { createElement, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { IBasketView } from '../../types';

export class Basket extends Component<IBasketView> {
	protected backedList: HTMLElement;
	protected baskedTotal: HTMLElement;
	basketButton: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this.backedList = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this.baskedTotal = this.container.querySelector('.basket__price');
		this.basketButton = this.container.querySelector('.basket__button');

		if (this.basketButton) {
			this.basketButton.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this.backedList.replaceChildren(...items);
		} else {
			this.backedList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set total(total: number) {
		this.setText(this.baskedTotal, `${total} синапсов`);
	}
}
