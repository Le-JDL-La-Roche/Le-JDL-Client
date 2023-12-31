import type { Env } from '$models/data/env.model'
import type { Notification } from '$models/data/notification.model'
import { writable } from 'svelte/store'
import { dev } from '$app/environment'
import type { Authorization } from '$models/data/authorization.model'

export let notification$ = writable<Notification | null>(null)
export let redirect$ = writable<string | null>(null)
export let env$ = writable<Env>()
export let liveStream$ = writable<boolean>(false)
export let showAcceptCookies$ = writable<boolean>(false)
export let printAuthorization$ = writable<
  | false
  | {
      type: 'emissions' | 'videos' | 'articles'
      guestId: false | number
      guestType: 'in' | 'out' | false
      authorization: Authorization
    }
>(false)
export const api = dev ? 'http://192.168.1.94:5000' : 'https://api.le-jdl-laroche.cf'
