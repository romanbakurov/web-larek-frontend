import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { ISuccess } from '../../types';

export class Success extends Component<ISuccess> {
	protected successClose: HTMLElement;
	protected successTotal: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this.successClose = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this.successTotal = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		this.successClose.addEventListener('click', () => {
			this.events.emit('order:completed');
		});
	}

	set total(total: string | number) {
		this.successTotal.textContent = `Списано ${total} синапсов`;
	}
}
