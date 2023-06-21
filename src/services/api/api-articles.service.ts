import http from '../http.module'
import type { DefaultHttpResponse } from '$models/responses/default-http-response.model'
import type { DataHttpResponse } from '$models/responses/data-http-response.model'
import { Buffer } from 'buffer'
import { api } from '$services/store'
import type { WebradioShow } from '$models/features/webradio-show.model'
import type { Article } from '$models/features/article.model'

export default class ApiArticlesService {
  async getArticles() {
    return await http.get<DataHttpResponse<{ articles: Article[] }>>(`${api}/articles`)
  }

  async getArticle(id: string) {
    return await http.delete<DataHttpResponse<{ article: Article }>>(`${api}/articles/${id}`)
  }

  async postArticle(article: Article) {
    const req: RequestInit = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return await http.post<DataHttpResponse<{ articles: Article[] }>>(`${api}/articles`, article, req)
  }

  async putArticle(article: Article, id: string) {
    const req: RequestInit = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return await http.put<DataHttpResponse<{ articles: Article[] }>>(`${api}/articles/${id}`, article, req)
  }


  async deleteArticle(id: string) {
    return await http.delete<DataHttpResponse<{ articles: Article[] }>>(`${api}/articles/${id}`)
  }
}
