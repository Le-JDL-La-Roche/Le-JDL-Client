import type { PageLoad } from './$types'
import { goto } from '$app/navigation'
import ApiAuthService from '$services/api/api-auth.service'
import CookiesService from '$services/cookies.service'
import ApiWebradioService from '$services/api/api-webradio.service'
import ApiVideosService from '$services/api/api-videos.service'
import ApiArticlesService from '$services/api/api-articles.service'
import ApiAuthorizationsService from '$services/api/api-authorizations.service'
import type { WebradioShow } from '$models/features/webradio-show.model'
import type { Video } from '$models/features/video.model'
import type { Article } from '$models/features/article.model'
import { error } from '@sveltejs/kit'
import type { Authorization } from '$models/data/authorization.model'

const apiAuth = new ApiAuthService()
const cookies = new CookiesService()
const apiWebradio = new ApiWebradioService()
const apiVideos = new ApiVideosService()
const apiArticles = new ApiArticlesService()
const apiAuthorizations = new ApiAuthorizationsService()

export const load: PageLoad = async ({ params }) => {
  const type = params.type as 'emissions' | 'videos' | 'articles'

  if (!cookies.get('JWT') || cookies.get('JWT') == null) {
    goto('/admin')
    return {}
  }

  ;(await apiAuth.getVerify()).subscribe({
    error: (err) => {
      cookies.delete('JWT')
      goto('/admin')
      return {}
    }
  })

  let data: (WebradioShow | Video | Article)[] = []

  if (type === 'emissions') {
    ;(await apiWebradio.getAllShows()).subscribe({
      next: (res) => {
        data = res.body.data?.shows || []
      },
      error: (err) => {
        error(err.status, err.body.message);
      }
    })
  } else if (type === 'videos') {
    ;(await apiVideos.getAllVideos()).subscribe({
      next: (res) => {
        data = res.body.data?.videos || []
      },
      error: (err) => {
        error(err.status, err.body.message);
      }
    })
  } else {
    ;(await apiArticles.getAllArticles()).subscribe({
      next: (res) => {
        data = res.body.data?.articles || []
      },
      error: (err) => {
        error(err.status, err.body.message);
      }
    })
  }

  let authorizations: Authorization[] = []

  ;(await apiAuthorizations.getAuthorizations()).subscribe({
    next: (res) => {
      authorizations = res.body.data?.authorizations || []
    },
    error: (err) => {
      error(err.status, err.body.message);
    }
  })

  return { type, data, authorizations }
}
