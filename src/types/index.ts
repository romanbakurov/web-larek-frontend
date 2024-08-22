//Интерфейс карточки товара
export interface IProductItem {
		id: string;
		description: string;
		image: string;
		title: string;
		category: string;
		price: number | null;
        button: string;
}

//Интерфейс формы закза
export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
	total: string | number;
    items: string[];
}


//Интерфейс успешного заказа
export interface IOrderResult {
	id: string;
	total: string | number;
}

//Интерфейс каталога
export interface ICardData {
	catalog: IProductItem[];
	preview: string | null;
	basket: IProductItem[];
	order: IOrderForm | null;
    setCatalog(catalog: IProductItem[]): void;
    getCatalog(productId: string): IProductItem | null;
    setPreview(product: IProductItem): void;
    setProductToBasket(product: IProductItem): void;
    setTotal(value: number): void;
    getTotal(): number;
    getBasket(): IProductItem[];
    getStatusBasket(): boolean;
    addProductToBasket(product: IProductItem): void;
    deleteProductFromBasket(productId: string, payload: Function | null): void;
    updateBasket(product: IProductItem, payload: Function | null): void;
    setOrder(item: keyof IOrderForm, value: string): void;
    validationOrder(): boolean;
}

//Интерфейс модального окна
export interface IModal {
	isModal: boolean;
	openModal(): void;
	closeModal(): void;
	render(data?: Partial<ICardData>): HTMLElement;
}

//Молка карточки товара
export type TCardItem = Pick<IProductItem, 'id' | 'description' | 'button'>;

//Товар в корзине
export type TCardBasket = Pick<IProductItem, 'id' | 'title' | 'price'>;

//Выбор способа оплаты
export type TPayment = 'онлайн' | 'при получении';

//Форма заказа с выборос способа оплаты и адрессом
export type TOrderForm = Pick<IOrderForm, 'payment' | 'address'>;

//Форма заказа с почтой и телефоном
export type TContactsForm = Pick<IOrderForm, 'email' | 'phone'>;

//Форма заказа
export type TOrder = TOrderForm & TContactsForm;

//Ошибки валидации формы
export type FormErrors = Partial<Record<keyof IOrderForm, string>>;
