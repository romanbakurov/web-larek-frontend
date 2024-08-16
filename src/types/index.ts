export interface IProductItem {
	id: string;
	description: string;
	images: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IOrder {
    id: string;
    total: number;
}

export interface IOrderForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

export interface IProductData {
    catalog: IProductItem[];
    preview: string | null;
    addProduct(product: IProductItem): void;
    getProduct(productId: string): IProductItem | null;
}

export interface IOrderData {
    products: TOrderPlaced[];
    addOrder(order: TOrderPlaced): void;
    deleteOrder(orderId: string, payload: Function | null): void;
    clearOrders(): void;
    getOrder(orderId: string): TOrderPlaced | null;
}

export type TOrder = IOrder & IProductItem

export type TProductInfo = Pick<TOrder, 'id' | 'images'| 'title' | 'category' | 'price'>
export type TBasketItem = Pick<TOrder, 'id' | 'title' | 'price' | 'total' >
export type TUserForm = Pick<IOrderForm, 'email' | 'phone' | 'address' | 'payment'>
export type TOrderPlaced = Pick<IOrder, 'id' | 'total'>

export type FormErrors = Partial<Record<keyof IOrder, string>>;
