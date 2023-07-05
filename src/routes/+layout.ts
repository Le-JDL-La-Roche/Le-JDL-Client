import type { LayoutLoad } from './$types'
import ApiEnvService from '$services/api/api-env.service'
import CookiesService from '$services/cookies.service'

export const prerender = false
export const ssr = false

const apiEnv = new ApiEnvService()
const cookies = new CookiesService()

export const load: LayoutLoad = async () => {
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
}
