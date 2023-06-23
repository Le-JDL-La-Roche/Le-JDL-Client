<script lang="ts">
  import { page } from '$app/stores'

  export let mobileNavOpen: boolean
  export let href: string
  export let exact: boolean = false
  export let customClass: string = ''
</script>

<a
  class={'not-a ' + customClass}
  {href}
  class:active={exact ? $page.url.pathname == href : $page.url.pathname.includes(href)}
  on:click={() => (mobileNavOpen = false)}
>
  <slot />
</a>

<style lang="scss">
  a {
    display: block;
    padding: 12px 15px;
    color: black;
    text-decoration: none;
    position: relative;

    &::before {
      content: '';
      height: 0;
      width: 3px;
      opacity: 0;
      background-color: var(--primary-red-color);
      border-radius: 2px;
      display: block;
      position: absolute;
      bottom: 0;
      transition: all 0.3s;
      top: calc(100% / 2);
      left: 0;
    }

    &.podcasts::before {
      background-color: var(--blue-color);
    }

    &.active::before {
      height: calc(100% - 24px);
      top: 12px;
      width: 3px;
      left: 0;
      opacity: 1;
    }

    &.podcasts.active::before {
      background-color: #232e86 !important;
    }
  }

  @media screen and (min-width: 850px) {
    a {
      display: inline-block;

      &::before {
        content: '';
        width: 0;
        height: 3px !important;
        top: auto;
        bottom: 0 !important;
        left: calc(100% / 2);
      }

      &:hover::before {
        width: calc(100% - 30px);
        background-color: var(--primary-red-color);
        opacity: 1;
        left: 15px;
      }

      &.podcasts:hover::before {
        background-color: var(--blue-color);
      }

      &:hover:active::before {
        width: calc(100% - 50px);
        left: 25px;
      }

      &.active::before {
        background-color: var(--secondary-red-color);
        opacity: 1;
        left: 15px;
        top: auto;
        width: calc(100% - 30px);
      }
    }
  }
</style>
