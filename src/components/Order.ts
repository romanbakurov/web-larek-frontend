import { IOrderForm } from '../types';
import { ensureAllElements } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export class OrderAddress extends Form<IOrderForm> {
	protected orderButton: HTMLButtonElement[];

	constructor(protected container: HTMLFormElement, event: IEvents) {
		super(container, event);
		this.orderButton = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);

		this.orderButton.forEach((button) => {
			button.addEventListener('click', () => {
				this.payment = button.name;
				event.emit('payment:change', button);
			});
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	set payment(value: string) {
		this.orderButton.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === value);
		});
	}
}

export class OrderContacts extends Form<IOrderForm> {
	constructor(protected container: HTMLFormElement, event: IEvents) {
		super(container, event);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
