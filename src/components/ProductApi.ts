import { IOrderForm, IOrderResult, IProductItem } from "../types";
import { Api, ApiListResponse } from "./base/api";

// Определяем интерфейс для API
export interface IProductApi {
    getProductList: () => Promise<IProductItem[]>;  // Метод для получения списка продуктов
    getProductItem: (id: string) => Promise<IProductItem>;  // Метод для получения конкретного продукта по id
    orderProducts: (order: IOrderForm) => Promise<IOrderResult>;  // Метод для размещения заказа продуктов
}

export class ProductApi extends Api implements IProductApi {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }
    getProductList(): Promise<IProductItem[]> {
        return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }
    
    getProductItem(id: string): Promise<IProductItem> {
        return this.get(`/product/${id}`).then(
            (item: IProductItem) => ({
                ...item,
                image: this.cdn + item.image
            })
        );
    }

    orderProducts(order: IOrderForm): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => {
                return {
                    ...data,
                    payment: order.payment,
                    address: order.address,
                    email: order.email,
                    phone: order.phone,
                    items: order.items
                }
    })
    }
}
