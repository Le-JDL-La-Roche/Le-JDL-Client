import type { ParamMatcher } from '@sveltejs/kit'

export const match: ParamMatcher = (param) => {
  const params = param.split('/')
  return params.length == 2 && ['podcast', 'video', 'article'].includes(params[0]) && /^\d{5}--[\w-]+$/.test(params[1])
}
