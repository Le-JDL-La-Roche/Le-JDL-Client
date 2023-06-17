import type { Env } from '$models/data/env.model'
import type { Notification } from '$models/data/notification.model'
import { writable } from 'svelte/store'
import { dev } from '$app/environment'

export let notification$ = writable<Notification | null>(null)
export let redirect$ = writable<string | null>(null)
export let env$ = writable<Env>()
export const api = dev ? 'http://localhost:3000' : 'https://api.le-jdl-laroche.cf'
