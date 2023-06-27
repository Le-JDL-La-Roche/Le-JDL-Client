import type { PageLoad } from './$types'
import { goto } from '$app/navigation'
import ApiAuthService from '$services/api/api-auth.service'
import CookiesService from '$services/cookies.service'
import ApiWebradioService from '$services/api/api-webradio.service'
import type { WebradioShow } from '$models/features/webradio-show.model'

const apiAuth = new ApiAuthService()
const cookies = new CookiesService()
const apiWebradio = new ApiWebradioService()

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

  let shows: WebradioShow[] = []

  ;(await apiWebradio.getAllShows()).subscribe({
    next: (res) => {
      shows = res.body.data?.shows || []
    }
  })

  return { shows }
}
