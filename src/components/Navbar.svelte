<script lang="ts">
  import NavbarLink from './NavbarLink.svelte'
  import { page } from '$app/stores'

  let mobileNavOpen: boolean = false
</script>

<nav>
  <div class="content mobile">
    <button class="menu" on:click={() => (mobileNavOpen = true)}><i class="fa-solid fa-bars" /></button>
  </div>
  <div class="content" class:open={mobileNavOpen}>
    <div class="nav">
      <button class="close mobile" on:click={() => (mobileNavOpen = false)}><i class="fa-solid fa-times" /></button>
      <NavbarLink href="/" exact bind:mobileNavOpen>
        <b>Accueil</b>
      </NavbarLink>
      <NavbarLink href="/actualites" bind:mobileNavOpen>Actualités</NavbarLink>
      <NavbarLink href="/culture" bind:mobileNavOpen>Culture</NavbarLink>
      <NavbarLink href="/sport" bind:mobileNavOpen>Sport</NavbarLink>
      <NavbarLink href="/sciences" bind:mobileNavOpen>Sciences</NavbarLink>
      <NavbarLink href="/tech" bind:mobileNavOpen>Tech</NavbarLink>
      <NavbarLink href="/laroche" bind:mobileNavOpen>La Roche</NavbarLink>
      <!-- <img src="/assets/images/new.png" alt="New" width="30" style="position: absolute; top: -3px; left: -3px; opacity: 93%" /> -->
      <NavbarLink href="/radio" bind:mobileNavOpen customClass="podcasts">Podcasts radio</NavbarLink>
    </div>
  </div>
  <!-- <ul class="content">
    <a class="not-a" href="/" class:active={$page.url.pathname == '/'}>
      <li>
        <b>Accueil</b>
      </li>
    </a>
    <a class="not-a" href="/actualites" class:active={$page.url.pathname.includes($$props.href)}>
      <li>Actualités</li>
    </a>
    <a class="not-a" href="/culture" class:active={$page.url.pathname.includes('/culture')}>
      <li>Culture</li>
    </a>
    <a class="not-a" href="/sport" class:active={$page.url.pathname.includes('/sport')}>
      <li>Sport</li>
    </a>
    <a class="not-a" href="/sciences" class:active={$page.url.pathname.includes('/sciences')}>
      <li>Sciences</li>
    </a>
    <a class="not-a" href="/tech" class:active={$page.url.pathname.includes('/tech')}>
      <li>Tech</li>
    </a>
    <a class="not-a" href="/laroche" class:active={$page.url.pathname.includes('/laroche')}>
      <li>La Roche</li>
    </a>

    <a class="not-a podcasts" href="/radio" class:active={$page.url.pathname.includes('/radio')} style="position: relative">
      <!- <img src="/assets/images/new.png" alt="New" width="30" style="position: absolute; top: -3px; left: -3px; opacity: 93%"> ->
      <li>Podcasts radio</li>
    </a>
  </ul> -->
</nav>

<style lang="scss">
  nav {
    background-color: var(--background-gray-color);
    margin: 0 auto 30px auto;

    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 5px 5px #00000020;

    button.close,
    button.menu {
      margin: 0;
      display: block;
      padding: 12px 15px;
      color: black;
      text-decoration: none;
      transition: all 0.3s;
      position: relative;
      border: none;
      background: none;
      outline: none;
      cursor: pointer;
      text-align: left;
    }

    button.close {
      margin-top: 0.1px;
      width: 100%;
    }

    div.content:not(.mobile) {
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 100%;
      overflow-x: hidden;
      z-index: 1000;
      background-color: var(--background-gray-color);
      transition: all 0.3s;
      display: block;

      div.nav {
        width: calc(100% - 25px);
        margin: 25px auto;
      }

      &.open {
        width: 100%;
      }
    }
  }

  @media screen and (min-width: 850px) {
    nav {
      position: relative;
      box-shadow: none;

      .mobile {
        display: none !important;
      }

      div.content:not(.mobile) {
        position: relative;
        width: 800px;
        height: auto;

        div.nav {
          width: auto;
          margin: auto;
          display: flex;
        }
      }
    }

    @media screen and (min-width: 1150px) {
      div.content:not(.mobile) {
        width: 1100px !important;
      }
    }
  }
</style>
