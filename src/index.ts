import './scss/styles.scss';
import { CardData } from './components/CardsData';
import { Api } from './components/base/api';
import { EventEmitter, IEvents } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { ProductApi } from './components/ProductApi';

// Модель данных приложения
const events: IEvents = new EventEmitter();
const cardsData = new CardData(events);

const api = new ProductApi(CDN_URL, API_URL);;



Promise.all([api.getProductList(), api.getProductItem("412bcf81-7e75-4e70-bdb9-d3c73c9803b7")])
    .then(([productList, productItem]) => {
        cardsData.catalog = productList;
        cardsData.basket = productList;
        cardsData.preview = productItem.id;
        cardsData.total = productItem.price;
        cardsData.setCatalog(productList);
        cardsData.setPreview(productItem);
        cardsData.setTotal(productItem.price);
        console.log(cardsData);
    })
    .catch(error => {
        console.error(error);
    });




