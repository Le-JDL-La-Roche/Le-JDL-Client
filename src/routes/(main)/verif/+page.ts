import type { PageLoad } from './$types'
import ApiAuthService from '$services/api/api-auth.service'
import CookiesService from '$services/cookies.service'
import ApiAuthorizationsService from '$services/api/api-authorizations.service'
import ApiWebradioService from '$services/api/api-webradio.service'
import ApiVideosService from '$services/api/api-videos.service'
import ApiArticlesService from '$services/api/api-articles.service'
import type { Article } from '$models/features/article.model'
import type { Video } from '$models/features/video.model'
import type { WebradioShow } from '$models/features/webradio-show.model'
import type { Authorization } from '$models/data/authorization.model'

const apiAuth = new ApiAuthService()
const apiAuthorizations = new ApiAuthorizationsService()
const apiWebradio = new ApiWebradioService()
const apiVideos = new ApiVideosService()
const apiArticles = new ApiArticlesService()
const cookies = new CookiesService()

export const load: PageLoad = async () => {
  if (!cookies.get('JWT_MAN') || cookies.get('JWT_MAN') == null) {
    return { logged: false }
  }

  let logged = false
  let data: {
    shows: WebradioShow[]
    videos: Video[]
    articles: Article[]
    authorizations: Authorization[]
  } = {
    shows: [],
    videos: [],
    articles: [],
    authorizations: []
  }

  ;(await apiAuth.getAuthMan()).subscribe({
    next: (res) => {
      logged = true
    },
    error: (err) => {
      cookies.delete('JWT')
      logged = false
    }
  })

  if (!logged) return { logged }
  ;(await apiWebradio.getAllShows()).subscribe({
    next: (res) => {
      data.shows = res.body.data?.shows || []
    }
  })
  ;(await apiVideos.getAllVideos()).subscribe({
    next: (res) => {
      data.videos = res.body.data?.videos || []
    }
  })
  ;(await apiArticles.getAllArticles()).subscribe({
    next: (res) => {
      data.articles = res.body.data?.articles || []
    }
  })
  ;(await apiAuthorizations.getAuthorizations()).subscribe({
    next: (res) => {
      data.authorizations = res.body.data?.authorizations || []
    }
  })

  return { logged, data }
}

