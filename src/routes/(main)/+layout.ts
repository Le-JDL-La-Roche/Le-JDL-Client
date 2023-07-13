import type { LayoutLoad } from './$types'
import ApiWebradioService from '$services/api/api-webradio.service'
import type { WebradioShow } from '$models/features/webradio-show.model'
import { liveStream$ } from '$services/store'
import type { WebradioQuestion } from '$models/features/webradio-question.model'
import CookiesService from '$services/cookies.service'
import { showAcceptCookies$ } from '$services/store'

const apiWebradio = new ApiWebradioService()
const cookies = new CookiesService()

export const load: LayoutLoad = async () => {
  let show: WebradioShow | false = false

  ;(await apiWebradio.getCurrentShow()).subscribe({
    next: (res) => {
      if (res.body.message === 'Success' && res.body.data?.show) {
        show = res.body.data.show
        liveStream$.set(true)
      }
    }
  })

  let questions: WebradioQuestion[] = []

  ;(await apiWebradio.getCurrentShowQuestions()).subscribe({
    next: (res) => {
      if (res.body.message === 'Success' && res.body.data?.questions) {
        questions = res.body.data?.questions
      }
    }
  })

  let acceptCookies = cookies.get('COOKIES') ? true : false
  showAcceptCookies$.set(!cookies.get('COOKIES'))

  return { show: show as WebradioShow | false, questions, acceptCookies }
}
