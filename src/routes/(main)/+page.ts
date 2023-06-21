import type { PageLoad } from './$types'
import ApiWebradioService from '$services/api/api-webradio.service'
import ApiVideosService from '$services/api/api-videos.service'
import ApiArticlesService from '$services/api/api-articles.service'
import type { WebradioShow } from '$models/features/webradio-show.model'
import type { Video } from '$models/features/video.model'
import type { Article } from '$models/features/article.model'

const apiWebradio = new ApiWebradioService()
const apiVideos = new ApiVideosService()
const apiArticles = new ApiArticlesService()

export const load: PageLoad = async () => {
  let data: {
    shows: WebradioShow[]
    currentShow: WebradioShow | null
    videos: Video[]
    articles: Article[]
  } = {
    shows: [],
    currentShow: null,
    videos: [],
    articles: []
  }

  ;(await apiWebradio.getPublishedShows()).subscribe({
    next: (res) => {
      data.shows = res.body.data?.shows || []
    }
  })
  ;(await apiVideos.getVideos()).subscribe({
    next: (res) => {
      data.videos = res.body.data?.videos || []
    }
  })
  ;(await apiArticles.getArticles()).subscribe({
    next: (res) => {
      data.articles = res.body.data?.articles || []
    }
  })

  return data
}
