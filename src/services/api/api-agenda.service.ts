import http from '../http.module'
import type { DataHttpResponse } from '$models/responses/data-http-response.model'
import { api } from '$services/store'
import type { Event } from '$models/features/agenda.model'

export default class ApiAgendaService {
  async getAgenda() {
    return await http.get<DataHttpResponse<{ agenda: Event[] }>>(`${api}/agenda`)
  }

  async postEvent(event: Event) {
    let body = new FormData()
    for (const [key, value] of Object.entries(event)) {
      body.set(key, value)
    }
    return await http.post<DataHttpResponse<{ agenda: Event[] }>>(`${api}/agenda`, body)
  }

  async putEvent(event: Partial<Event>, id: number | string) {
    let body = new FormData()
    for (const [key, value] of Object.entries(event)) {
      if (typeof value === 'number') {
        body.set(key, value.toString())
      } else {
        body.set(key, value)
      }
    }
    return await http.put<DataHttpResponse<{ agenda: Event[] }>>(`${api}/agenda/${id}`, body)
  }

  async deleteEvent(id: number | string) {
    return await http.delete<DataHttpResponse<{ agenda: Event[] }>>(`${api}/agenda/${id}`)
  }
}
