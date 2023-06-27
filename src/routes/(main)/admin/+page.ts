import type { PageLoad } from './$types'
import ApiAuthService from '$services/api/api-auth.service'
import CookiesService from '$services/cookies.service'

const apiAuth = new ApiAuthService()
const cookies = new CookiesService()

export const load: PageLoad = async () => {
  console.log('run');
  
  if (!cookies.get('JWT') || cookies.get('JWT') == null) {
    return { logged: false }
  }

  let logged = false

  ;(await apiAuth.getVerify()).subscribe({
    next: (res) => {
      logged = true
    },
    error: (err) => {
      cookies.delete('JWT')
      logged = false
    }
  })

  return { logged }
}
