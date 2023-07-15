import http from '../http.module'
import type { DataHttpResponse } from '$models/responses/data-http-response.model'
import { api } from '$services/store'
import type { Authorization } from '$models/data/authorization.model'
import type { DefaultHttpResponse } from '$models/responses/default-http-response.model'

export default class ApiAuthorizationsService {
  async getAuthorization(id: number | string) {
    return await http.get<DataHttpResponse<{ authorization: Authorization }>>(`${api}/authorizations/${id}`)
  }

  async postAuthorization(authorization: Authorization) {
    return await http.post<DataHttpResponse<{ authorization: Authorization }>>(`${api}/authorizations`, authorization)
  }

  async putAuthorization(authorization: Partial<Authorization>, id: number | string) {
    return await http.put<DataHttpResponse<{ authorization: Authorization }>>(`${api}/authorizations/${id}`, authorization)
  }

  async deleteAuthorization(id: number | string) {
    return await http.delete<DefaultHttpResponse>(`${api}/authorizations/${id}`)
  }
}
