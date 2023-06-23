import http from '../http.module'
import type { DefaultHttpResponse } from '$models/responses/default-http-response.model'
import type { DataHttpResponse } from '$models/responses/data-http-response.model'
import { api } from '$services/store'

export default class ApiEnvService {
  async getEnv() {
    return await http.get<DataHttpResponse<any>>(`${api}/env`)
  }

  async putVisits() {
    return await http.put<DefaultHttpResponse>(`${api}/visits`)
  }
}
