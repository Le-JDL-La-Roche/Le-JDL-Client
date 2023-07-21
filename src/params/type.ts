import type { ParamMatcher } from '@sveltejs/kit'

export const match: ParamMatcher = (param) => {
  return ['emissions', 'videos', 'articles'].includes(param)
}
