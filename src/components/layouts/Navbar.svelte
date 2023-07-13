<script lang="ts">
  import NavbarLink from './NavbarLink.svelte'
  import { liveStream$ } from '$services/store'

  let mobileNavOpen: boolean = false
  let navbarStyle = ''

  liveStream$.subscribe((value) => {
    if (value) {
      navbarStyle = 'top: 61px'
    } else {
      navbarStyle = ''
    }
  })
</script>

<nav style={navbarStyle}>
  <div class="content mobile">
    <button class="menu" on:click={() => (mobileNavOpen = true)}><i class="fa-solid fa-bars" /></button>
  </div>
  <div class="content" class:open={mobileNavOpen}>
    <div class="nav">
      <button class="close mobile" on:click={() => (mobileNavOpen = false)}><i class="fa-solid fa-times" /></button>
      <NavbarLink href="/" exact bind:mobileNavOpen>
        <strong>Accueil</strong>
      </NavbarLink>
      <NavbarLink href="/actualites" bind:mobileNavOpen>Actualités</NavbarLink>
      <NavbarLink href="/culture" bind:mobileNavOpen>Culture</NavbarLink>
      <NavbarLink href="/sport" bind:mobileNavOpen>Sport</NavbarLink>
      <NavbarLink href="/sciences" bind:mobileNavOpen>Sciences</NavbarLink>
      <NavbarLink href="/tech" bind:mobileNavOpen>Tech</NavbarLink>
      <NavbarLink href="/laroche" bind:mobileNavOpen>La Roche</NavbarLink>
      <NavbarLink href="/radio" bind:mobileNavOpen customClass="podcasts">Podcasts radio</NavbarLink>
    </div>
  </div>
</nav>

<style lang="scss">
  nav {
    background-color: var(--background-gray-color);
    margin: 0 auto 30px auto;
    position: sticky;
    top: 0;
    z-index: 1000;
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
      margin-top: 0.05px;
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
        position: relative;
        width: calc(100% - 25px);
        margin: 25px auto;
        z-index: 10000000;
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
      top: 0 !important;
      z-index: 100;

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
          z-index: 1;
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
