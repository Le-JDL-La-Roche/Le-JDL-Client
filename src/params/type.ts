import type { ParamMatcher } from '@sveltejs/kit'
import utils from '$services/utils'

export const match: ParamMatcher = (param) => {
  return ['emissions', 'videos', 'articles'].includes(param)
}
