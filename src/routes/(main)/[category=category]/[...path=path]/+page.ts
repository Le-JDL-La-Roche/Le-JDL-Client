import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import type { Video } from '$models/features/video.model'
import type { Article } from '$models/features/article.model'
import type { WebradioShow } from '$models/features/webradio-show.model'
import ApiWebradioService from '$services/api/api-webradio.service'
import ApiVideosService from '$services/api/api-videos.service'
import ApiArticlesService from '$services/api/api-articles.service'
import CookiesService from '$services/cookies.service'
import utils from '$services/utils'

const apiWebradio = new ApiWebradioService()
const apiVideos = new ApiVideosService()
const apiArticles = new ApiArticlesService()
const cookies = new CookiesService()

export const load: PageLoad = async ({ params }) => {
  const categoryParam: string = params.category
  const pathParam: string[] = params.path.split('/')

  if (!utils.categories.includes(categoryParam)) {
    throw error(404, 'Non trouvée')
  }

  const category = categoryParam as 'actualites' | 'culture' | 'sport' | 'sciences' | 'tech' | 'laroche' | 'radio'

  return {}
}
