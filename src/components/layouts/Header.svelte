<script lang="ts">
  import Navbar from './Navbar.svelte'
  import { page } from '$app/stores'
</script>

<header>
  <div class="content">
    <h1>
      <a href="/" class:active={$page.url.pathname == '/'} class="not-a"><img src="/assets/images/v2/logo.png" alt="Le JDL" /></a>
    </h1>
  </div>
</header>
<Navbar />

<style lang="scss">
  header {
    background-color: var(--background-gray-color);
    padding: 25px 0 20px 0;
  }

  h1 {
    text-align: center;
    margin: 0;

    img {
      width: 150px;
      transition: all 0.3s;
    }

    a.active img {
      width: 220px;
    }
  }
</style>
