import http from '../http.module'
import type { DefaultHttpResponse } from '$models/responses/default-http-response.model'
import type { DataHttpResponse } from '$models/responses/data-http-response.model'
import { Buffer } from 'buffer'
import { api } from '$services/store'
import type { WebradioShow } from '$models/features/webradio-show.model'
import type { Video } from '$models/features/video.model'

export default class ApiVideosService {
  async getVideos() {
    return await http.get<DataHttpResponse<{ videos: Video[] }>>(`${api}/videos`)
  }

  async getVideo(id: string) {
    return await http.delete<DataHttpResponse<{ video: Video }>>(`${api}/videos/${id}`)
  }

  async postVideo(video: Video) {
    const req: RequestInit = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return await http.post<DataHttpResponse<{ videos: Video[] }>>(`${api}/videos`, video, req)
  }

  async putVideo(video: Video, id: string) {
    const req: RequestInit = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return await http.put<DataHttpResponse<{ videos: Video[] }>>(`${api}/videos/${id}`, video, req)
  }


  async deleteVideo(id: string) {
    return await http.delete<DataHttpResponse<{ videos: Video[] }>>(`${api}/videos/${id}`)
  }
}
