// Определяет тип ответа API, который возвращает список элементов.
export type ApiListResponse<Type> = {
	total: number; // Общее количество элементов.
	items: Type[]; // Массив элементов типа Type.
};

// Определяет допустимые HTTP методы для запросов POST.
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Базовый класс для работы с API.
export class Api {
	readonly baseUrl: string; // Базовый URL для всех API запросов.
	protected options: RequestInit; // Настройки для запросов.

	// Конструктор принимает базовый URL и опции для запросов.
	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json', // Устанавливает тип содержимого по умолчанию.
				...((options.headers as object) ?? {}), // Объединяет переданные заголовки с заголовками по умолчанию.
			},
		};
	}

	// Обрабатывает ответ от сервера. Если ответ успешный, возвращает JSON.
	// В случае ошибки возвращает ошибку, извлекая её из ответа.
	protected handleResponse(response: Response): Promise<object> {
		if (response.ok) return response.json();
		else
			return response
				.json()
				.then((data) => Promise.reject(data.error ?? response.statusText));
	}

	// Выполняет GET запрос к указанному URI.
	get(uri: string) {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method: 'GET',
		}).then(this.handleResponse);
	}

	// Выполняет POST, PUT или DELETE запрос к указанному URI с переданными данными.
	post(uri: string, data: object, method: ApiPostMethods = 'POST') {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data), // Преобразует данные в JSON строку.
		}).then(this.handleResponse);
	}
}
