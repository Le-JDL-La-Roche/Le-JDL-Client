import type { PageLoad } from './$types'
import ApiWebradioService from '$services/api/api-webradio.service'
import ApiVideosService from '$services/api/api-videos.service'
import ApiArticlesService from '$services/api/api-articles.service'
import ApiEnvService from '$services/api/api-env.service'
import type { WebradioShow } from '$models/features/webradio-show.model'
import type { Video } from '$models/features/video.model'
import type { Article } from '$models/features/article.model'
import type { Journalist } from '$models/data/journalist.model'
import type { Event } from '$models/features/agenda.model'
import ApiAgendaService from '$services/api/api-agenda.service'

const apiWebradio = new ApiWebradioService()
const apiVideos = new ApiVideosService()
const apiArticles = new ApiArticlesService()
const apiEnv = new ApiEnvService()
const apiAgenda = new ApiAgendaService()

export const load: PageLoad = async () => {
  let data: {
    shows: WebradioShow[]
    currentShow: WebradioShow | null
    videos: Video[]
    articles: Article[]
    journalists: Journalist[],
    agenda: Event[]
  } = {
    shows: [],
    currentShow: null,
    videos: [],
    articles: [],
    journalists: [],
    agenda: []
  }

  ;(await apiWebradio.getPublishedShows()).subscribe({
    next: (res) => {
      data.shows = res.body.data?.shows || []
    }
  })
  ;(await apiVideos.getPublishedVideos()).subscribe({
    next: (res) => {
      data.videos = res.body.data?.videos || []
    }
  })
  ;(await apiArticles.getPublishedArticles()).subscribe({
    next: (res) => {
      data.articles = res.body.data?.articles || []
    }
  })
  ;(await apiEnv.getJournalists()).subscribe({
    next: (res) => {
      data.journalists =
        res.body.data?.journalists.sort((a, b) => {
          if (a.name.split(' ')[1] < b.name.split(' ')[1]) return -1
          else return 1
        }) || []
    }
  })
  ;(await apiAgenda.getAgenda()).subscribe({
    next: (res) => {
      data.agenda = res.body.data?.agenda || []
    }
  })

  return data
}
