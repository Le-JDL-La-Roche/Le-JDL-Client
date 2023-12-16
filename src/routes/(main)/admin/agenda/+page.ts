import type { Event } from '$models/features/agenda.model';
import ApiAgendaService from '$services/api/api-agenda.service';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types'

const apiAgenda = new ApiAgendaService()

export const load: PageLoad = async () => {
  let data: Event[] = []
  ;(await apiAgenda.getAgenda()).subscribe({
    next: (res) => {
      data = res.body.data?.agenda!
    },
    error: (err) => {
      error(err.status, err.body.message);
    }
  })

  return { data }
}
