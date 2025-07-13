import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders } from "axios"
import Http from "@/enums/http"
import sweetalert from "./sweetalert"
import { axiosOptions } from "@/types/axios"
import { Exception } from "@/handlers/exception"

export const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
    timeout: 360000,
    maxContentLength: 1073741824,
    maxBodyLength: 1073741824,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': '*',
    },
})

export const intern = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_APP_URL}`,
    timeout: 360000,
    maxContentLength: 1073741824,
    maxBodyLength: 1073741824,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': '*',
    },
})

intern.interceptors.response.use((response: AxiosResponse) => response, (error: AxiosError) => error.response)

api.interceptors.response.use((response: AxiosResponse) => response, (error: AxiosError) => error.response)

export async function request<T = any>({
  url,
  method = 'GET',
  data = null,
  token = '',
  process = true,
  message = true,
  raw = false,
  rawUrl = false,
  auth = true,
}: axiosOptions) {
  const axios = raw ? intern : api
  var options: AxiosRequestConfig = {
    method: method,
    url: url,
  }

  if (token) {
    options.headers = {
      Authorization: `Bearer ${token}`
    }
  }

  if (data) {
    if (method === 'GET') {
      options.params = data
    } else {
      options.data = data
    }
  }

  if (rawUrl) {
    options.baseURL = ''
  }

  const request = axios.request(options)

  if (process) {
    const response = request.then((response: AxiosResponse<T>) => {
      if (!Http.ok(response.status)) {
        if (response instanceof XMLHttpRequest) {
          throw new Exception(
            { message: 'Erro ao realizar requisição' },
            response.status > 0 ? response.status : Http.status('InternalServerError'),
            response.statusText ? response.statusText : 'Internal Server Error',
            response.headers as any,
            response.config,
            response.request,
          )
          return
        }
        throw response
      }

      return response
    }).catch((error: AxiosResponse<T> | Exception) => {
      try {
        intern.post('/api/logs', { data: error })
      } catch (er) { }

      if (typeof window !== 'undefined' && message) {
        if (Http.is('Unauthorized', error.status)) {
          location.href = '/'
        } else if (Http.is('Forbidden', error.status)) {
          sweetalert.error({
            title: 'Acesso negado',
            html: error.data && error.data.message ? error.data.message : 'Você não tem permissão para realizar esta ação.',
            allowOutsideClick: false,
          }).then(result => location.href = '/')
        } else if (Http.is('UnprocessableContent', error.status)) {
          sweetalert.unprocessable({ response: error, message: error.data && error.data.message ? error.data.message : 'Erro ao realizar requisição' })
        } else {
          sweetalert.error({ html: error.data && error.data.message ? error.data.message : error.statusText })
        }
      }

      throw new Exception<T>(error.data, error.status, error.statusText, error.headers as any, error.config, error.request)
      return
    })

    return response as Promise<AxiosResponse<T>>
  }

  return request as Promise<AxiosResponse<T>>
}

export default {
  get: (options: Omit<axiosOptions, 'method'>) => request({ ...options, method: 'GET' }),
  post: (options: Omit<axiosOptions, 'method'>) => request({ ...options, method: 'POST' }),
  put: (options: Omit<axiosOptions, 'method'>) => request({ ...options, method: 'PUT' }),
  patch: (options: Omit<axiosOptions, 'method'>) => request({ ...options, method: 'PATCH' }),
  delete: (options: Omit<axiosOptions, 'method'>) => request({ ...options, method: 'DELETE' }),
  raw: (options: axiosOptions) => request(options),
}
