import fetch, {RequestInit} from 'node-fetch';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface Response {
    data?: any;
    error?: Error;
}

export interface Options {
    headers?: HeadersInit;
    body?: string;
    payload?: object;
    token?: string;
    method?: Method;
}

export async function wrapped(url: string, { headers = {}, payload, token, method = 'GET' }: Options) {
    const options: RequestInit = {};
    options.method = method;
    // @ts-ignore
    options.headers = {
        'Content-Type': 'application/json',
        ...headers,
    };

    if (payload) {
        options.body = JSON.stringify(payload);
    }

    if (token) {
        options.headers = { ...options.headers, Authorization: `Bearer ${token}` };
    }

    return await fetch(`${url}`, options);
}
