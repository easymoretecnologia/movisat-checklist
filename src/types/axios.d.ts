import { MethodCode } from "@/enums/http"
import { AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders, ResponseType } from "axios"

export type axiosOptions<T = any> = {
    url: string
    method?: MethodCode
    data?: AxiosRequestConfig<T> | T
    token?: string
    process?: boolean
    message?: boolean
    raw?: boolean
    rawUrl?: boolean
    headers?: AxiosResponseHeaders
    responseType?: ResponseType
    auth?: boolean
}
