import { ApiConfig } from '../../types/configs/ApiConfig';
import { API_URL } from '../constants';

export class Api {
    baseUrl: string;
    noAuthHeaders: HeadersInit;
    authHeaders: () => HeadersInit;

    constructor({ baseUrl, noAuthHeaders, authHeaders }: ApiConfig) {
        this.baseUrl = baseUrl;
        this.noAuthHeaders = noAuthHeaders;
        this.authHeaders = authHeaders;
    }

    checkResponse = (res: Response) => {
        if (res.ok) {
            return res.json();
        } else {
            return Promise.reject(`Error${res.status}`);
        }
    };

    sendRequest = (
        url: string,
        method: string,
        headers: HeadersInit,
        body?: any
    ) => {
        return fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        }).then((res) => this.checkResponse(res));
    };

    createRequest = (
        url: string,
        method: string,
        headers: HeadersInit,
        body?: any
    ) => {
        return this.sendRequest(
            `${this.baseUrl}/${url}`,
            method,
            headers,
            body
        );
    };
}

export const apiConfig = {
    baseUrl: API_URL,
    authHeaders: () => ({
        authorization: 'Bearer ' + localStorage.getItem('jwt'),
        'Content-Type': 'application/json',
    }),
    noAuthHeaders: {
        'Content-Type': 'application/json',
    },
};
