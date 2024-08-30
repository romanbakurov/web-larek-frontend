//Интерфейс карточки товара
export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

//Интерфейс формы закза
export interface IOrderForm {
	payment: string;
	address: string;
	phone: string;
	email: string;
	total: string | number;
}

//Интерфейс заказа
export interface IOrder extends IOrderForm {
	items: string[];
}

//Интерфейс успешного заказа
export interface IOrderResult {
	id: string;
	total: string | number;
}

//Интерфейс валидации
export interface IFormState {
	valid: boolean;
	errors: string[];
}

//Интерфейс изменения каталога
export type CatalogChangeEvent = {
	catalog: IProductItem[];
};

//Интерфейс карточки
export interface ICardData {
	catalog: IProductItem[];
	preview: string;
	basket: IProductItem[];
	order: IOrder;
	total: string | number;
	loading: boolean;
	setCatalog: (items: IProductItem[]) => void;
	setPreview: (item: IProductItem) => void;
	setProductToBasket: (item: IProductItem) => void;
	setTotal: (value: number) => void;
	getTotal: () => number;
	getBasket: () => string[];
	getStatusBasket: () => boolean;
	addProductToOrder: (item: IProductItem) => void;
	removeProductFromOrder: (item: IProductItem) => void;
	removeProductFromBasket: (item: IProductItem) => void;
	clearBasket: () => void;
	setOrderAddress: (item: keyof IOrderForm, value: string) => void;
	setOrderContacts: (item: keyof IOrderForm, value: string) => void;
	validationOrderAddress: () => void;
	validationOrderContacts: () => void;
	orderCompleted: () => void;
}

//Интерфейс карточки в корзине
export interface ICardBasket {
	index: number;
	title: string;
	price: number;
}

//Интерфейс каталога
export interface IProductsList {
	products: IProductItem[];
}

//Интерфейс корзины
export interface IBasketView {
	items: HTMLElement[];
	total: number;
}

//Интерфейс главной страницы
export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

//Интерфейс для успешного заказа
export interface ISuccess {
	total: string | number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

//Интерфейс для API
export interface IAppAPI {
	getProductList: () => Promise<IProductItem[]>; // Метод для получения списка продуктов
	getProductItem: (id: string) => Promise<IProductItem>; // Метод для получения конкретного продукта по id
	orderProducts: (order: IOrderForm) => Promise<IOrderResult>; // Метод для размещения заказа продуктов
}
