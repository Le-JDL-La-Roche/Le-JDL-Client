import type { LayoutLoad } from './$types'
import ApiWebradioService from '$services/api/api-webradio.service'
import type { WebradioShow } from '$models/features/webradio-show.model'
import { liveStream$ } from '$services/store'
import type { WebradioQuestion } from '$models/features/webradio-question.model'
import CookiesService from '$services/cookies.service'
import { showAcceptCookies$ } from '$services/store'
import ApiEnvService from '$services/api/api-env.service'

const apiWebradio = new ApiWebradioService()
const cookies = new CookiesService()
const apiEnv = new ApiEnvService()

export const load: LayoutLoad = async () => {
  let show = false as WebradioShow | false
  ;(await apiWebradio.getCurrentShow()).subscribe({
    next: (res) => {
      if (res.body.message === 'Success' && res.body.data?.show) {
        show = res.body.data.show
      }
    }
  })
  if (show) {
    ;(await apiWebradio.checkStream(show.streamId)).subscribe({
      next: () => {
        liveStream$.set(true)
      },
      error: () => {
        liveStream$.set(false)
      }
    })
  }

  let questions: WebradioQuestion[] = []

  ;(await apiWebradio.getCurrentShowQuestions()).subscribe({
    next: (res) => {
      if (res.body.message === 'Success' && res.body.data?.questions) {
        questions = res.body.data?.questions
      }
    }
  })

  if (!sessionStorage.getItem('VISITED')) {
    if (!cookies.get('JWT')) {
      ;(await apiEnv.putVisits()).subscribe({
        next: () => {
          sessionStorage.setItem('VISITED', new Date(new Date().setHours(0, 0, 0, 0)).getTime() / 1000 + '')
        }
      })
    } else {
      sessionStorage.setItem('VISITED', 'admin')
    }
  }

  let acceptCookies = cookies.get('COOKIES') ? true : false
  showAcceptCookies$.set(!cookies.get('COOKIES'))

  return { show, questions, acceptCookies }
}
