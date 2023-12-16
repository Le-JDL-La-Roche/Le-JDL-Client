import type { PageLoad } from './$types'
import CookiesService from '$services/cookies.service'
import ApiAuthService from '$services/api/api-auth.service'
import ApiWebradioService from '$services/api/api-webradio.service'
import { goto } from '$app/navigation'
import type { WebradioShow } from '$models/features/webradio-show.model'
import type { WebradioQuestion } from '$models/features/webradio-question.model'

const cookies = new CookiesService()
const apiAuth = new ApiAuthService()
const apiWebradio = new ApiWebradioService()

export const load: PageLoad = async () => {
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

  let show: WebradioShow | null = null

  ;(await apiWebradio.getCurrentShow()).subscribe({
    next: (res) => {
      if (res.body.message === 'Success' && res.body.data?.show) {
        show = res.body.data.show
      } else {
        goto('/admin/emissions')
      }
    },
    error: (err) => {
      goto('/admin/emissions')
    }
  })

  let questions: WebradioQuestion[] = []

  ;(await apiWebradio.getCurrentShowQuestions()).subscribe({
    next: (res) => {
      if (res.body.message === 'Success' && res.body.data?.questions) {
        questions = res.body.data.questions
      }
    }
  })

  return { show: show as WebradioShow | null, questions }
}
