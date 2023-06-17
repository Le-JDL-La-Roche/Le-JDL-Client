import http from '../http.module'
import type { DefaultHttpResponse } from '$models/responses/default-http-response.model'
import type { DataHttpResponse } from '$models/responses/data-http-response.model'
import { Buffer } from 'buffer'
import { api } from '$services/store'

export default class ApiAuthService {
  async getAuth(name: string, password: string) {
    const req: RequestInit = {
      headers: {
        Authorization: 'Basic ' + Buffer.from(name + ':' + password).toString('base64')
      }
    }
    return await http.get<DataHttpResponse<{ jwt: string }>>(`${api}/auth`, req)
  }

  async getVerify() {
    return await http.get<DataHttpResponse<{ jwt: string }>>(`${api}/verify`)
  }

  async deleteLogout() {
    return await http.delete<DefaultHttpResponse>(`${api}/logout`)
  }
}
