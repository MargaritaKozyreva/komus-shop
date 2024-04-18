/* eslint-disable no-mixed-spaces-and-tabs */
import axios from 'axios';
import { _url } from './service-tools';

/**
 * Функция обращения к серверу (GET запрос)
 * @param url - адрес API, к которому необходимо обратиться
 * @returns - данные ответа
 */
const httpService = async (
	method,
	action,
	query,
	data,
	config
) => {
	try {
		const response = await axios({
			method: method,
			baseURL: _url(action, query),
			data: data instanceof FormData ? data : JSON.stringify(data),
			config: config
		});
		return {
			data: response.data,
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
			config: response.config
		};
	} catch (e) {
		throw new Error('Bad Request! ' + e);
	}
};

const httpServiceMock = (mockData) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			return resolve({
				data: mockData,
				status: 200,
				statusText: 'success',
				headers: [],
				config: {}
			});
		}, 1500);
	});
};

export { httpService, httpServiceMock };
