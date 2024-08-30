import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

interface IModalData {
	content: HTMLElement;
}

export class Modal extends Component<IModalData> {
	protected modalCloseButton: HTMLButtonElement;
	protected modalContent: HTMLElement;

	constructor(container: HTMLElement, protected events?: IEvents) {
		super(container);

		this.modalCloseButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this.modalContent = ensureElement<HTMLElement>('.modal__content', container);

		this.modalCloseButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this.modalContent.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this.modalContent.replaceChildren(value);
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove('modal_active');
		this.events.emit('modal:close');
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
