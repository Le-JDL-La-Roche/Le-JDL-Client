import http from '../http.module'
import type { DataHttpResponse } from '$models/responses/data-http-response.model'
import { api } from '$services/store'
import type { Info } from '$models/features/info.model'

export default class ApiInfoService {
  async getInfo() {
    return await http.get<DataHttpResponse<{ info: Info[] }>>(`${api}/info`)
  }

  async postInfo(info: Info) {
    return await http.post<DataHttpResponse<{ info: Info[] }>>(`${api}/info`, info)
  }

  async putInfo(info: Partial<Info>, id: number | string) {
    return await http.put<DataHttpResponse<{ info: Info[] }>>(`${api}/info/${id}`, info)
  }

  async deleteInfo(id: number | string) {
    return await http.delete<DataHttpResponse<{ info: Info[] }>>(`${api}/info/${id}`)
  }

  async putResetInfo() {
    return await http.put<DataHttpResponse<{ info: Info[] }>>(`${api}/info/reset`)
  }
}
