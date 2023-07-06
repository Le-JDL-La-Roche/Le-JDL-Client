import { goto } from '$app/navigation'
import type { Env } from '$models/data/env.model'
import ApiAuthService from '$services/api/api-auth.service'
import ApiEnvService from '$services/api/api-env.service'
import CookiesService from '$services/cookies.service'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import type { Journalist } from '$models/data/journalist.model'

const cookies = new CookiesService()
const apiAuth = new ApiAuthService()
const apiEnv = new ApiEnvService()

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
