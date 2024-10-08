import type { Observable, HttpResponse } from '$models/responses/api-response.model'
import type { DefaultHttpResponse } from '$models/responses/default-http-response.model'
import { redirect } from '@sveltejs/kit'
import CookiesService from './cookies.service'

const cookies = new CookiesService()

class Http {
  private headers: Record<string, string> = {}

  async get<T extends DefaultHttpResponse>(url: string, req?: RequestInit) {
    return this.sendRequest<T>(url, 'GET', req)
  }

  async post<T extends DefaultHttpResponse>(url: string, body?: any, req?: RequestInit) {
    return this.sendRequest<T>(url, 'POST', req, body)
  }

  async put<T extends DefaultHttpResponse>(url: string, body?: any, req?: RequestInit) {
    return this.sendRequest<T>(url, 'PUT', req, body)
  }

  async delete<T extends DefaultHttpResponse>(url: string, body?: any, req?: RequestInit) {
    return this.sendRequest<T>(url, 'DELETE', req, body)
  }

  private sendRequest<T extends DefaultHttpResponse>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    req: RequestInit = {},
    body: any = {}
  ): Promise<Observable<T>> {
    return fetch(url, this.setRequest(url, method, req, body))
      .then(async (response: Response) => {
        const contentType = response.headers.get('Content-Type')
        const isJson = contentType?.includes('application/json')
        const body = isJson ? await response.json() : await response.text()
        return { response, body }
      })
      .then((response) => {
        return { response: response.response, body: response.body as T }
      })
      .then((response) => {
        this.responseInterceptor(response, url, method)
        return this.setResponse(response)
      })
  }

  private setRequest(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', req?: RequestInit, body?: any): RequestInit {
    this.headers = {}

    this.sendInterceptor(url)

    let body_: any

    if (body instanceof FormData) {
      body_ = body
      delete this.headers['Content-Type']
    } else {
      body_ = this.urlEncode(body)
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    let req_: RequestInit = {
      ...req,
      method: method,
      headers: {
        ...this.headers,
        ...req?.headers
      },
      body: body_
    }

    if (method == 'GET') {
      delete req_.body
    }

    return req_
  }

  private setResponse<T>(response: { response: Response; body: T }): Observable<T> {
    const resp = {
      headers: response.response.headers,
      ok: response.response.ok,
      redirected: response.response.redirected,
      status: response.response.status,
      statusText: response.response.statusText,
      type: response.response.type,
      url: response.response.url,
      body: response.body
    }
    return {
      subscribe(observe: {
        next?: (resp: HttpResponse<T>) => void
        error?: (resp: HttpResponse<T>) => void
        finally?: (resp: HttpResponse<T>) => void
      }): void {
        if (resp.ok && observe.next) {
          observe.next(resp)
        } else if (!resp.ok && observe.error) {
          observe.error(resp)
        }
        if (observe.finally) {
          observe.finally(resp)
        }
      }
    }
  }

  private urlEncode(object: any): string {
    let formBody = []
    for (let property in object) {
      let encodedKey = encodeURIComponent(property)
      let encodedValue = encodeURIComponent(object[property])
      formBody.push(encodedKey + '=' + encodedValue)
    }
    return formBody.join('&')
  }

  private sendInterceptor(url: string): void {
    if (this.headers['Authorization'] && this.headers['Authorization'].length > 7) {
      return
    } else if (cookies.get('JWT_MAN')) {
      this.headers = { ...this.headers, ...{ Authorization: 'Bearer ' + cookies.get('JWT_MAN') } }
    } else if (url.includes('/authorizations') || (!url.includes('/auth') && !url.includes('/register'))) {
      this.headers = { ...this.headers, ...{ Authorization: 'Bearer ' + cookies.get('JWT') } }
    }
  }

  private responseInterceptor<T extends DefaultHttpResponse>(
    response: { response: Response; body: T },
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  ): void {
    if (response.body.code == 'AUTH_ERROR') {
      if (
        (url.includes('/verify') || response.body.message == 'Token expired') &&
        window.location.pathname != '/admin' &&
        window.location.pathname.includes('/admin')
      ) {
        redirect(300, '/admin')
      }
    } else if (response.body.code == 'DB_ERROR') {
      // TODO: Handle DB errors
    }
  }
}

export default new Http()
