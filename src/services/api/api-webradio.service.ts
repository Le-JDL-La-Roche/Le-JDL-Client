import http from '../http.module'
import type { DataHttpResponse } from '$models/responses/data-http-response.model'
import { api } from '$services/store'
import type { WebradioShow } from '$models/features/webradio-show.model'
import type { WebradioQuestion } from '$models/features/webradio-question.model'

export default class ApiWebradioService {
  async getPublishedShows() {
    return await http.get<DataHttpResponse<{ shows: WebradioShow[] }>>(`${api}/webradio/shows`)
  }

  async getCurrentShow() {
    return await http.get<DataHttpResponse<{ show: WebradioShow }>>(`${api}/webradio/shows/current`)
  }

  async getAllShows() {
    return await http.get<DataHttpResponse<{ shows: WebradioShow[] }>>(`${api}/webradio/shows/all`)
  }

  async getShow(id: number | string) {
    return await http.get<DataHttpResponse<{ show: WebradioShow }>>(`${api}/webradio/shows/${id}`)
  }

  async postShow(show: WebradioShow) {
    let body = new FormData()
    for (const [key, value] of Object.entries(show)) {
      body.set(key, value)
    }
    return await http.post<DataHttpResponse<{ shows: WebradioShow[] }>>(`${api}/webradio/shows`, body)
  }

  async putShow(show: Partial<WebradioShow>, id: number | string) {
    let body = new FormData()
    for (const [key, value] of Object.entries(show)) {
      if (typeof value === 'number') {
        body.set(key, value.toString())
      } else {
        body.set(key, value as any)
      }
    }
    return await http.put<DataHttpResponse<{ shows: WebradioShow[] }>>(`${api}/webradio/shows/${id}`, body)
  }

  async deleteShow(id: number | string) {
    return await http.delete<DataHttpResponse<{ shows: WebradioShow[] }>>(`${api}/webradio/shows/${id}`)
  }

  async getCurrentShowQuestions() {
    return await http.get<DataHttpResponse<{ questions: WebradioQuestion[] }>>(`${api}/webradio/questions/current`)
  }

  async postQuestion(question: WebradioQuestion['question']) {
    return await http.post<DataHttpResponse<{ questions: WebradioQuestion[] }>>(`${api}/webradio/questions`, { question })
  }

  async deleteQuestion(id: number | string) {
    return await http.delete<DataHttpResponse<{ questions: WebradioQuestion[] }>>(`${api}/webradio/questions/${id}`)
  }

  async checkStream(streamId: string) {
    const req: RequestInit = {
      headers: { 'Content-Type': 'text/plain charset=UTF-8' }
    }
    return await http.get<any>(`https://radio.le-jdl-laroche.cf/hls/${streamId}.m3u8`, req)
  }
}
