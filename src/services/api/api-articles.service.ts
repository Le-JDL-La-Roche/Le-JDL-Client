import http from '../http.module'
import type { DefaultHttpResponse } from '$models/responses/default-http-response.model'
import type { DataHttpResponse } from '$models/responses/data-http-response.model'
import { Buffer } from 'buffer'
import { api } from '$services/store'
import type { WebradioShow } from '$models/features/webradio-show.model'
import type { Article } from '$models/features/article.model'

export default class ApiArticlesService {
  async getPublishedArticles() {
    return await http.get<DataHttpResponse<{ articles: Article[] }>>(`${api}/articles`)
  }

  async getAllArticles() {
    return await http.get<DataHttpResponse<{ articles: Article[] }>>(`${api}/articles/all`)
  }

  async getArticle(id: number | string) {
    return await http.get<DataHttpResponse<{ article: Article }>>(`${api}/articles/${id}`)
  }

  async postArticle(article: Article) {
    let body = new FormData()
    for (const [key, value] of Object.entries(article)) {
      body.set(key, value)
    }
    return await http.post<DataHttpResponse<{ articles: Article[] }>>(`${api}/articles`, body)
  }

  async putArticle(article: Partial<Article>, id: number | string) {
    let body = new FormData()
    for (const [key, value] of Object.entries(article)) {
      if (typeof value === 'number') {
        body.set(key, value.toString())
      } else {
        body.set(key, value)
      }
    }
    return await http.put<DataHttpResponse<{ articles: Article[] }>>(`${api}/articles/${id}`, body)
  }

  async deleteArticle(id: number | string) {
    return await http.delete<DataHttpResponse<{ articles: Article[] }>>(`${api}/articles/${id}`)
  }
}
