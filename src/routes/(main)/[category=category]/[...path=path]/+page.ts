import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import type { Video } from '$models/features/video.model'
import type { Article } from '$models/features/article.model'
import type { WebradioShow } from '$models/features/webradio-show.model'
import ApiWebradioService from '$services/api/api-webradio.service'
import ApiVideosService from '$services/api/api-videos.service'
import ApiArticlesService from '$services/api/api-articles.service'
import ContentService from '$services/content.service'
import utils from '$services/utils'

const apiWebradio = new ApiWebradioService()
const apiVideos = new ApiVideosService()
const apiArticles = new ApiArticlesService()

export const load: PageLoad = async ({ params }) => {
  const categoryParam: string = params.category
  const [type, slug]: string[] = params.path.split('/')

  if (!utils.categories.includes(categoryParam)) {
    throw error(404, 'Non trouvée')
  }

  const category = categoryParam as 'actualites' | 'culture' | 'sport' | 'sciences' | 'tech' | 'laroche' | 'radio'

  let data: WebradioShow | Video | Article | undefined  

  if (type === 'podcast') {
    ;(await apiWebradio.getShow(+slug.split('--')[0])).subscribe({
      next: (res) => {
        data = res.body.data?.show
      },
      error: () => {
        throw error(404, 'Non trouvée')
      }
    })
    data
  } else if (type === 'video') {
    ;(await apiVideos.getVideo(+slug.split('--')[0])).subscribe({
      next: (res) => {
        data = res.body.data?.video
      },
      error: () => {
        throw error(404, 'Non trouvée')
      }
    })
  } else {
    ;(await apiArticles.getArticle(+slug.split('--')[0])).subscribe({
      next: (res) => {
        data = res.body.data?.article
      },
      error: () => {
        throw error(404, 'Non trouvée')
      }
    })
  }

  if (!data) {
    throw error(404, 'Non trouvée')
  }

  if ('category' in data) {
    if (data.category !== utils.categoriesFr[category].id) {
      throw error(404, 'Non trouvée')
    }
  }

  return { data, type }
}
