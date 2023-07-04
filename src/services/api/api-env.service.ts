import http from '../http.module'
import type { DefaultHttpResponse } from '$models/responses/default-http-response.model'
import type { DataHttpResponse } from '$models/responses/data-http-response.model'
import { api } from '$services/store'

export default class ApiEnvService {
  async getEnv() {
    return await http.get<DataHttpResponse<{ visits: Visits; shows: Shows; videos: Videos; articles: Articles }>>(`${api}/env`)
  }

  async putVisits() {
    return await http.put<DefaultHttpResponse>(`${api}/visits`)
  }

  async deleteAdminVisits(timestamp: number) {
    return await http.delete<DefaultHttpResponse>(`${api}/visits/${timestamp}`)
  }
}

interface Visits {
  total: number
  visits: {
    id: number
    timestamp: number
    visits: number
  }[]
}

interface Shows {
  total: number
  status: {
    draft: number
    live: number
    waiting: number
    podcast: number
  }
}

interface Videos {
  total: number
  category: {
    news: number
    culture: number
    sport: number
    science: number
    tech: number
    laroche: number
  }
  type: {
    youtube: number
    instagram: number
  }
}

interface Articles {
  total: number
  category: {
    news: number
    culture: number
    sport: number
    science: number
    tech: number
    laroche: number
  }
}
