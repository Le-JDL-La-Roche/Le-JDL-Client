import type { Journalist } from '$models/data/journalist.model'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import ApiEnvService from '$services/api/api-env.service'

const apiEnv = new ApiEnvService()

export const load: PageLoad = async () => {
  let data: Journalist[] = []
  ;(await apiEnv.getJournalists()).subscribe({
    next: (res) => {
      data = res.body.data?.journalists!
    },
    error: (err) => {
      throw error(err.status, err.body.message)
    }
  })

  return { data }
}
