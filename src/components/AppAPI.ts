import { IAppAPI, IOrder, IOrderResult, IProductItem } from '../types';
import { Api, ApiListResponse } from './base/api';

export class AppAPI extends Api implements IAppAPI {
	readonly ind: string;

	constructor(ind: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.ind = ind;
	}
	getProductList(): Promise<IProductItem[]> {
		return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
			data.items.map((item) => ({
				...item,
				image: item.image,
			}))
		);
	}

	getProductItem(id: string): Promise<IProductItem> {
		return this.get(`/product/${id}`).then((item: IProductItem) => ({
			...item,
			image: item.image,
		}));
	}

	orderProducts(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
