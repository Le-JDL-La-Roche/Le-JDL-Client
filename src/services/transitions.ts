import { fade } from 'svelte/transition'
import { cubicInOut } from 'svelte/easing'

export function popIn(node: HTMLElement) {
  return {
    duration: 500,
    css: (t: number) => {
      const eased = cubicInOut(t)
      return `
        z-index: ${101 - eased};
        position: relative;
        opacity: ${eased};
        transform: scale(${1.7 - 0.7 * eased});`
    }
  }
}

export function popOut(node: HTMLElement) {
  return {
    duration: 500,
    css: (t: number) => {
      const eased = cubicInOut(t)
      return `
        position: absolute;
        width: 100%;
        opacity: ${eased};
        transform: scale(${eased});`
    }
  }
}
