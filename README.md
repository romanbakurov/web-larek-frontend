# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

### Данные и типы данных используемые в приложении:
Продукт

```
export interface IProductItem {
	id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
  }
```

Данные формы заказа

```
export interface IOrderForm {
	payment: string;
	address: string;
	phone: string;
	email: string;
	total: string | number;
  }

   export interface IOrder extends IOrderForm {
	items: string[];
  }
```

Успешный заказ
```
 export interface IOrderResult {
	id: string;
	total: string | number;
  }

  export interface ISuccess {
    total: string | number;
}
```

Интерфейс валидации
```
  export interface IFormState {
	  valid: boolean;
	  errors: string[];
  }
```

Интерфейс изменения каталога
```
 export type CatalogChangeEvent = {
	catalog: IProductItem[]
  };
```

Интерфейс для модели хранения коллекции продукта

```
export interface ICardData {
	catalog: IProductItem[];
	preview: string;
	basket: string[];
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
```

Интерфейс для хранения карточки в корзине

```
  export interface ICardBasket {
	  index: number,
	  title: string,
	  price: number,
  }
```

Интерфейс каталога

```
 export interface IProductsList {
	products: IProductItem[];
  }
```

Интерфейс корзины
```
export interface IBasketView {
	  items: HTMLElement[];
	  total: number;
  }
```

Интерфейс главной страницы
```
 export interface IPage {
	  counter: number;
	  catalog: HTMLElement[];
	  locked: boolean;
  }

Данные типа ошибки заказа
```
export type FormErrors = Partial<Record<keyof IOrder, string>>;
```

Интерфейс API
```
 export interface IAppAPI {
	  getProductList: () => Promise<IProductItem[]>; // Метод для получения списка продуктов
	  getProductItem: (id: string) => Promise<IProductItem>; // Метод для получения конкретного продукта по id
	  orderProducts: (order: IOrderForm) => Promise<IOrderResult>; // Метод для размещения заказа продуктов
  }
  ```

## Архитектура приложения 
Код приложения разделен на слои согласно парадигме MVP: 

- слой данных, отвечает за хранение и передачу данных
- слой представления, отвечает за отображение данных на странице
- презентер, отвечает за связь представления и данных

### Базовый код

#### Класс API
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес с сервера и опциональный объект с заголовками запроса. 
Методы:

- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:

- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

#### Класс "Component"
Этот базовый компонент представляет собой абстрактный класс для создания компонентов, управляющих DOM-элементами.\
Конструктор:
-принимает на вход `container` типа HTMLElement

Методы:
- `toggleClass` - переключает CSS класс
- `setText` - устанавливает текстовое содержимое
- `setDisabled` - изменяет статус блокировки
- `setHidden` - скрывает HTML-элемент
- `setVisible` - показывает HTML-элемент
- `setImage` - устанавливает изображения с алтернативным текстом
- `render` - возвращает корневой DOM-элемент

#### Класс "Model"
Этот базовый компонент представляет собой абстрактный класс дженерик, обощающий в себе конструктор и метод привязки события.

Конструктор:

- принимает на вход объект данных неявного типа и объект события типа IEvent.
- производит слияние входящего объекта с родительским

Методы:

- `emmitChanges` — регистрирует входящее событие в EventEmitter

### Слой данных

#### Класс CardsData
Класс отвечает за хранение и логику работы с данными товара.\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:
- `catalog: IProductItem[]` - массив объектов товара
- `preview: string | null` - id товара, выбранного для просмотра в модальном окне
- `basket: IProductItem[]` - массив объектов корзины
- `order: IOrder` - данные заказа

Также класс предосмтавляет набор методов для взаимодействия с этими данными
- `setCatalog(products: IProductItem[]): void` - получает данные каталога
- `setPreview(product: IProductItem): void` - получает данные при просмотре товара
- `setProductToBasket(product: IProductItem): void` - получает данные в корзине
- `setTotal(value: number): void` - изменяет данные финальной стоимости товара
- `getBasket(): IProductItem[]` - изменяет данные в корзине
- `getStatusBasket(): boolean` - изменяет статус в корзине
- `addProductToBasket(product: IProductItem): void` - добавляет данные товара в корзину
- `removeProductFromBasket(product: IProductItem): void` - удаляет данные товара из корзины
- `removeProductPriceBasket(product: IProductItem): void` - удаляет стоимость из корзины
- `clearCountBasket(): void` - очищает счетчик корзины после успешного заказа
- `setOrderAddress(item: keyof IOrderForm, value: string): void` - получает данные выбора оплаты и адреса от пользвателя
- `setOrderContacts(item: keyof IOrderForm, value: string): void` - получает данные почты и телефона от пользвателя
- `validationOrder(): boolean` - валидация данных вводимых пользвателем

#### Modal
Принимает разметку модального окна, отвечает за отображение обертки содержимого модальных окон.\
Поля класса:
- `modalContent` - разметка контейнера для содержимого модального окна
- `modalCloseButton` - кнопка закрытия модального окна

Конструктор:
- принимает `сontainer` с типом HTMLElement и `evt` с типом IEvent
- передает данные в родительский конструктор
- записывает нужные данные в поля класса
- добаляет слушатель на `modalCloseButton` и `container` для закртия модалки, вешает слушатель на `content`, чтобы модалка не закрылась

Методы:
- `setter сontent(value: HTMLElement)` - устанавливает содержимое модального окна
- `open():void` - открывает модальное окно, добавляет CSS класс для отображения и генерирует событие открытия
- `close():void` - закрывает модально окно, удаляет CSS класс, очищает и генерирует событие закрытия
- `render(element: HTMLElement)` - отрисовывает данные и открывает модалку

#### Form
Класс отвечает за обертку форм с данными, работу с ними.
Рассширяет класс Component. Предназначен для реализации формы содержащей поля ввода.\
Поля:
- `formSubmit: HTMLButtonElement` - кнопка "Далее"
- `formErrors: HTMLElement` - хранит разметку поля ошибок в инпутах

Конструктор:
- принимает `container:HTMLElement`, `evt:IEvent`,
- сохраняет информацию разметки в поля класса,
- передает в родительский констрктор данные,
- добавляет слушатели на сабмит и инпуты

Методы:
- `onInputChange(field: keyof T, value: string): void` - обрабатывает изменения в инпутах
- `setter valid: boolean` - устанавливает состояние валидности формы
- `setter errors: string` - устанавливает текст ошибок
- `render(state: Partial<T> & IFormState): HTMLFormElement` - отрисовывает форму в соответствии с текущим состоянием

#### Basket
Рассширяет класс Component. Предназначен для реализации корзины: кнопки сабмита, полной стоимости.\
Поля:
- `items` - хранит список товаров
- `backedList: HTMLElement` - хранит разметку списка товаров
- `baskedTotal: HTMLElement` - отображает полную стоимость товаров в корзине
- `basketButton: HTMLElement` - хранит разметку кнопки

Конструктор:
- принимает `container` типа HTMLElement и `event` типа IEvent
- записывает данные в поля
- передает данные в родительский конструктор
- вешает слушатель на кнопку сабмита

Методы:
- `setter total: number` - устанавливает финальную сумму
- `setter items: HTMLElement[]` - устанавливает карточки в разметку `_list`

#### OrderAddress
Рассширяет класс Form. Предназначен для реализации первого модального окна оплаты заказа с выбором способа оплаты и адреса доставки.\
Поля:
- `orderButton: HTMLButtonElement[]` — хранит разметку кнопок формы оплаты

Конструктор:
- принимает `container:HTMLElement` и объект `event:IEvent`
- передает данные в родительский конструктор
- сохраняет необходимые элементы разметки в полях
- на кнопки выбора формы оплаты вешает слушатель 'click'

Методы
- `setter payment: string` — устанавливает класс активности на кнопку
- `seteer address: string` — устанавливает значение поля адрес

#### OrderContacts
Рассширяет класс Form. Предназначен для реализации второго модального окна оплаты заказа.\

Конструктор:
- принимает `container:HTMLElement` и объект `event:IEvent`
- передает данные в родительский конструктор
- сохраняет необходимые элементы разметки в полях
- на кнопки выбора формы оплаты вешает слушатель 'click'

Методы:
- `setter phone: string` — устанавливает значение поля телефон
- `seteer email: string` — устанавливает значение поля почты

#### Success
Рассширяет класс Component. Предназначен для реализации данных успешного оформления заказа.\
Поля:
- `successTotal: HTMLElement` - общая сумма товаров 
- `successClose: HTMLElement` - кнопка закрытия окна

Конструктор:
- принимает `container:HTMLElement` и `actions:ISuccessActions`.
- сохраняет необходимые данные в поля класса
- вешает слушатель на кнопку `_close`
- передает данные в родительский конструктор

Методы:
- `setter total: string | number` - установка полной стоимости

#### Card
Рассширяет класс Component. Отвечает за отображение, задавая в карточке товара данные: название, изображение, категорию, цену. Класс используется для отображения карточек товара на странице сайта.\
Поля:
- `cardTitle: HTMLElement` - название карточки товара
- `cardCategory: HTMLElement` - категория карточки товара
- `cardImage: HTMLImageElement` - изображение карточки товара
- `cardPrice: HTMLElement` - цена карточки товара
- `cardId: string` - Id карточки
- `cardCategoryColor: Record<string, string>` - цвет категории карточки товара

Конструктор:
- принимает: container:HTMLElement и action:ICardAction
- передает container в родительский конструктор
- записывает данные в необходимые поля
- устанавливаются слушаетли на все интерактивные элементы, в результате взаимодействия с которыми генерируются соответствующие события

Методы:
- `setter title: string` - устанавливает название карточки товара
- `setter category: string` - устанавливает данные категори карточки товара
- `setter image: string` - устанавливает даныне изображение карточки товара
- `setter price: number` - устанавливает данные цены карточки товара, если цена равна null, тогда устанавливается ценна "Бесценно"

### CardPreview
Класс отображает превью выбранной карточки. Расширяется классом Card, так как там есть основные данные карточки, с помощью интерфейса ICardDescription, проверяет наличие данного текста.\
Поля:

- `cardButton?: HTMLButtonElement` - кнопка "В корзину"
- `cardDescription: HTMLElement` - описание карточки товара

Конструктор:

- принимает: container:HTMLElement и action:ICardAction
- записывает данные разметки в поля
- передает `container` и `action` в родительский конструктор

Методы:
- `setter description: string` - устанавливает текст описания
- `setter disabled: boolean` - устанавливает состояние кнопки (активна/неактивна)

#### CardBasket
Данный класс отвечает за отображение данных карточки в корзине.\
Поля:
- `cardIndex: HTMLElement` - защищенное свойство типа HTMLElement, представляющее индекс элемента корзины
- `cardTitle: HTMLElement` - защищенное свойство типа HTMLElement, представляющее заголовок элемента корзины
- `cardPrice: HTMLElement` - защищенное свойство типа HTMLElement, представляющее цену товара
- `cardButton: HTMLButtonElement` - защищенное свойство типа HTMLButtonElement, представляющее кнопку удаления элемента корзины

Конструктор:
- принимает container: HTMLElement и action:ICardAction
- передает в родительский конструктор container
- записывает данные разметки в поля класса

Методы:
- `setter index: number` - устанавливает данные индекса в соответсвии со значением параметра value
- `setter title: string` - устанавливает данные названия
- `setter price: number` - устанавливает данные цены

 #### Page
 Отвечает за отображение всех элементов на главной странице: корзины, счетчика корзины, каталога товаров\
 Поля:
 - `pageCounter: HTMLElement` - защищенное свойство типа HTMLElement, представляющее счетчик товаров в корзине
- `pageCatalog: HTMLElement` - защищенное свойство типа HTMLElement, представляющее каталог товаров
- `pageBasket: HTMLElement` - защищенное свойство типа HTMLElement, представляющее элемент корзины
- `pageWrapper: HTMLElement` - защищенное свойство типа HTMLElement, представляющее обертку страницы

Методы:
- `seteer counter: number` - устанавливает счетчик корзины, в соответствии со значением value, преобразованным в строку
- `setter catalog: HTMLElement[]` - устанавливает каталог с товаром, в соответствии с массивом items, заменяя текущих дочерних элементов на новые;
- `setter locked: boolean` - отвечает за то, чтобы страница не прокручивалась

### Слой коммуникации

#### Класс AppAPI
Принимает в конструктор экземпляр класса Api и предоставаляет метода реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействия представления и данных между собой находится в файле `index.ts`, выполняющим роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчика этих событий, описанных в `indecx.ts`.\
В `indecx.ts` сначала создаются экземпляры всех необходимых классов, а потом настраиваестя обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `cards:changed` - изменение массива карточек
- `card:selected` - изменения открытия в модальном окне карточки товара

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*\
- `card-preview:changed` - изменение карточки товара
- `card:addToBasket` - отправка карточки в корзину
- `basket:open` - открытие корзины
- `basket:changed` - изменения интерфейса корзины
- `basket:delete` - удаление карточки из интерфейса корзины
- `order:open` - открытие формы заказа
- `order:submit` - подтверджение формы оплаты
- `order:completed` - закрытие формы после успешного заказа
- `contacts:submit` - подтверджение формы контактов
- `modal:open` - открытие модального окна
- `modal:close` - закрытие модального окна