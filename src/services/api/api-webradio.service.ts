import http from '../http.module'
import type { DefaultHttpResponse } from '$models/responses/default-http-response.model'
import type { DataHttpResponse } from '$models/responses/data-http-response.model'
import { Buffer } from 'buffer'
import { api } from '$services/store'
import type { WebradioShow } from '$models/features/webradio-show.model'

export default class ApiWebradioService {
  async getPublishedShows() {
    return await http.get<DataHttpResponse<{ shows: WebradioShow[] }>>(`${api}/webradio/shows`)
  }

  async getCurrentShow() {
    return await http.get<DataHttpResponse<{ show: WebradioShow }>>(`${api}/webradio/shows/current`)
  }

  async getAllShows() {
    return await http.delete<DataHttpResponse<{ shows: WebradioShow[] }>>(`${api}/webradio/shows/all`)
  }

  async getShow(id: string) {
    return await http.delete<DataHttpResponse<{ show: WebradioShow }>>(`${api}/webradio/shows/${id}`)
  }

  async postShow(show: WebradioShow) {
    const req: RequestInit = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return await http.post<DataHttpResponse<{ shows: WebradioShow[] }>>(`${api}/webradio/shows`, show, req)
  }

  async putShow(show: WebradioShow, id: string) {
    const req: RequestInit = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return await http.put<DataHttpResponse<{ shows: WebradioShow[] }>>(`${api}/webradio/shows/${id}`, show, req)
  }


  async deleteShow(id: string) {
    return await http.delete<DataHttpResponse<{ shows: WebradioShow[] }>>(`${api}/webradio/shows/${id}`)
  }
}
