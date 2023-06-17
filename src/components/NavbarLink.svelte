<script lang="ts">
  import { page } from '$app/stores'

  export let mobile: boolean
  export let mobileNavOpen: boolean
  export let href: string
  export let exact: boolean = false
  export let customClass: string = ''
</script>

{#if !mobile}
  <a class={'not-a ' + customClass} {href} class:active={exact ? $page.url.pathname == href : $page.url.pathname.includes(href)}>
    <slot />
  </a>
{:else}
  <a
    class={'not-a mobile ' + customClass}
    {href}
    class:active={exact ? $page.url.pathname == href : $page.url.pathname.includes(href)}
    on:click={() => (mobileNavOpen = false)}
  >
    <slot />
  </a>
{/if}

<style lang="scss">
  a {
    display: inline-block;
    padding: 12px 15px;
    color: black;
    text-decoration: none;
    transition: all 0.3s;
    position: relative;

    &::before {
      content: '';
      width: 0;
      height: 3px;
      opacity: 0;
      background-color: var(--primary-red-color);
      border-radius: 2px;
      display: block;
      position: absolute;
      bottom: 0;
      transition: all 0.3s;
      left: calc(100% / 2);
    }

    &.podcasts::before {
      background-color: var(--blue-color);
    }

    &:hover::before {
      width: calc(100% - 30px) !important;
      background-color: var(--primary-red-color) !important;
      opacity: 1 !important;
      left: 15px !important;
    }

    &.podcasts:hover::before {
      background-color: var(--blue-color) !important;
    }

    &:hover:active::before {
      width: calc(100% - 50px) !important;
      left: 25px !important;
    }

    &.active::before {
      background-color: var(--secondary-red-color);
      opacity: 1;
      left: 15px;
      width: calc(100% - 30px);
    }

    &.podcasts.active::before {
      background-color: #232e86 !important;
    }
  }

  a.mobile {
    display: block;
    padding: 12px 15px;
    color: black;
    text-decoration: none;
    position: relative;

    p {
      margin: 0;
      padding-left: 15px;
      min-width: 50vw;
    }

    &::before {
      content: '';
      height: 0;
      width: 3px !important;
      opacity: 0;
      background-color: var(--primary-red-color);
      border-radius: 2px;
      display: block;
      position: absolute;
      bottom: 0;
      transition: all 0.3s;
      top: calc(100% / 2);
      left: 0 !important;
    }

    // &:hover::before {
    //   height: calc(100% - 24px) !important;
    //   top: 12px !important;
    //   width: 3px !important;
    //   left: 0 !important;
    // }

    // &:hover:active::before {
    //   height: calc(100% - 24px) !important;
    //   top: 12px !important;
    //   width: 3px !important;
    //   left: 0 !important;
    // }

    &.active::before {
      height: calc(100% - 24px) !important;
      top: 12px !important;
      width: 3px !important;
      left: 0 !important;
      opacity: 1 !important;
    }
  }
</style>
