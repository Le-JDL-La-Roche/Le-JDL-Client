import type { LayoutLoad } from './$types'
import ApiWebradioService from '$services/api/api-webradio.service'
import type { WebradioShow } from '$models/features/webradio-show.model'
import { liveStream$ } from '$services/store'

const apiWebradio = new ApiWebradioService()

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

  return { show: show as WebradioShow | false }
}