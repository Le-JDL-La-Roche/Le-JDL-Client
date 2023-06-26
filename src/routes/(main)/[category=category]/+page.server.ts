import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { Video } from '$models/features/video.model'
import type { Article } from '$models/features/article.model'
import type { WebradioShow } from '$models/features/webradio-show.model'
import ApiWebradioService from '$services/api/api-webradio.service'
import ApiVideosService from '$services/api/api-videos.service'
import ApiArticlesService from '$services/api/api-articles.service'
import utils from '$services/utils'

const apiWebradio = new ApiWebradioService()
const apiVideos = new ApiVideosService()
const apiArticles = new ApiArticlesService()

export const load: PageServerLoad = async ({ params, cookies }) => {
  const category = params.category as 'actualites' | 'culture' | 'sport' | 'sciences' | 'tech' | 'laroche' | 'radio'

  let data: (WebradioShow | Video | Article)[] = []
  let videos: Video[] = []
  let articles: Article[] = []

  if (!cookies.get('SHOW_ARTICLES')) {
    cookies.set('SHOW_ARTICLES', 'true')
  }

  if (!cookies.get('ORDER_BY')) {
    cookies.set('ORDER_BY', 'date')
  }

  if (category === 'radio') {
    ;(await apiWebradio.getPublishedShows()).subscribe({
      next: (res) => {
        data = res.body.data?.shows || []
      }
    })
  } else {
    ;(await apiVideos.getVideos()).subscribe({
      next: (res) => {
        videos = res.body.data?.videos || []
        videos = videos.filter((video) => video.category === utils.categoriesFr[category].id)
      }
    })
    if (cookies.get('SHOW_ARTICLES') == 'true') {
      ;(await apiArticles.getArticles()).subscribe({
        next: (res) => {
          articles = res.body.data?.articles || []
          articles = articles.filter((article) => article.category === utils.categoriesFr[category].id)
        }
      })
    }
    if (cookies.get('ORDER_BY') == 'date') {
      data = [...videos, ...articles].sort((a: Video | Article, b: Video | Article) => +a.date - +b.date).reverse()
    } else if (cookies.get('ORDER_BY') == 'type') {
      data = [...videos, ...articles]
    } else {
      data = [...videos, ...articles].sort((a: Video | Article, b: Video | Article) =>
        a.title.toUpperCase() > b.title.toUpperCase() ? 1 : b.title.toUpperCase() > a.title.toUpperCase() ? -1 : 0
      )
    }
  }

  return {
    category: utils.categoriesFr[category],
    data
  }
}
