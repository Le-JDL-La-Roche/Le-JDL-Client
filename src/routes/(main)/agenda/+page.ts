import type { PageLoad } from './$types'
import type { Event } from '$models/features/agenda.model'
import ApiAgendaService from '$services/api/api-agenda.service'

const apiAgenda = new ApiAgendaService()

export const load: PageLoad = async () => {
  let agenda: Event[] = []

  ;(await apiAgenda.getAgenda()).subscribe({
    next: (res) => {
      agenda = res.body.data?.agenda || []
    }
  })

  return { agenda }
}
