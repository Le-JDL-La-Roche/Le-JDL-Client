import type { PageLoad } from './$types'
import { goto } from '$app/navigation'
import ApiAuthService from '$services/api/api-auth.service'
import CookiesService from '$services/cookies.service'
import ApiWebradioService from '$services/api/api-webradio.service'
import ApiVideosService from '$services/api/api-videos.service'
import ApiArticlesService from '$services/api/api-articles.service'
import type { WebradioShow } from '$models/features/webradio-show.model'
import type { Video } from '$models/features/video.model'
import type { Article } from '$models/features/article.model'
import { error } from '@sveltejs/kit'

const apiAuth = new ApiAuthService()
const cookies = new CookiesService()
const apiWebradio = new ApiWebradioService()
const apiVideos = new ApiVideosService()
const apiArticles = new ApiArticlesService()

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
        throw error(err.status, err.body.message)
      }
    })
  } else if (type === 'videos') {
    ;(await apiVideos.getVideos()).subscribe({
      next: (res) => {
        data = res.body.data?.videos || []
      },
      error: (err) => {
        throw error(err.status, err.body.message)
      }
    })
  } else {
    ;(await apiArticles.getArticles()).subscribe({
      next: (res) => {
        data = res.body.data?.articles || []
      },
      error: (err) => {
        throw error(err.status, err.body.message)
      }
    })
  }

  return { type, data }
}
