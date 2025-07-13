import { StatusCode } from "@/enums/http";
import { AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders } from "axios";

export class Exception<T = any> implements Pick<AxiosResponse<T, any>, 'data' | 'status' | 'statusText'> {
    data: T;
    status: StatusCode;
    statusText: string;
    headers?: AxiosResponseHeaders;
    config?: AxiosRequestConfig<T>;
    request?: any;

    constructor(data: T, status: StatusCode, statusText: string, headers?: AxiosResponseHeaders, config?: AxiosRequestConfig<T>, request?: any) {
        this.data = data;
        this.status = status;
        this.statusText = statusText;
        this.headers = headers;
        this.config = config;
        this.request = request;
    }
}

export class Common<T = any> {
    data: T;
    status: StatusCode;
    statusText: string;
    error: boolean;

    constructor(data: T, status: StatusCode, statusText: string) {
        this.data = data;
        this.status = status;
        this.statusText = statusText;
        this.error = true;
    }
}