import type { Event } from '$models/features/agenda.model';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types'
import ApiInfoService from '$services/api/api-info.service';
import type { Info } from '$models/features/info.model';

const apiInfo = new ApiInfoService()

export const load: PageLoad = async () => {
  let data: Info[] = []
  ;(await apiInfo.getInfo()).subscribe({
    next: (res) => {
      data = res.body.data?.info!
    },
    error: (err) => {
      error(err.status, err.body.message)
    }
  })

  return { data }
}
