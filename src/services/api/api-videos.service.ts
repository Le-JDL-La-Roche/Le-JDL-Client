import http from '../http.module'
import type { DataHttpResponse } from '$models/responses/data-http-response.model'
import { api } from '$services/store'
import type { Video } from '$models/features/video.model'

export default class ApiVideosService {
  async getPublishedVideos() {
    return await http.get<DataHttpResponse<{ videos: Video[] }>>(`${api}/videos`)
  }

  async getAllVideos() {
    return await http.get<DataHttpResponse<{ videos: Video[] }>>(`${api}/videos/all`)
  }

  async getVideo(id: number | string) {
    return await http.get<DataHttpResponse<{ video: Video }>>(`${api}/videos/${id}`)
  }

  async postVideo(video: Video) {
    let body = new FormData()
    for (const [key, value] of Object.entries(video)) {
      body.set(key, value)
    }
    return await http.post<DataHttpResponse<{ videos: Video[] }>>(`${api}/videos`, body)
  }

  async putVideo(video: Partial<Video>, id: number | string) {
    let body = new FormData()
    for (const [key, value] of Object.entries(video)) {
      if (typeof value === 'number') {
        body.set(key, value.toString())
      } else {
        body.set(key, value)
      }
    }
    return await http.put<DataHttpResponse<{ videos: Video[] }>>(`${api}/videos/${id}`, body)
  }

  async deleteVideo(id: number | string) {
    return await http.delete<DataHttpResponse<{ videos: Video[] }>>(`${api}/videos/${id}`)
  }
}
