<script lang="ts">
  import { goto } from '$app/navigation'
  import type { PageData } from './$types'

  export let data: PageData

  if (!data.show) {
    goto('/admin/emissions')
  }
</script>

<svelte:head>
  <title>Questions en direct • Le JDL - La Roche</title>
</svelte:head>

{#if data.show}
  <div class="main">
    <div class="header">
      <div class="content">
        <h2>
          <a href="/admin/emissions" class="not-a">
            <button class="secondary">
              <i class="fa-solid fa-caret-left" />&nbsp;&nbsp;Retour
            </button>
          </a>
          Questions en direct
        </h2>
        <h1>{data.show.title}</h1>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  div.main {
    background: linear-gradient(137deg, #606c88, #191654);
    min-height: 100vh;
  }

  div.header {
    background: linear-gradient(137deg, #606c88, #191654);
    background-size: 100vw 100vh;
    padding: 30px 0 20px 0;
    box-shadow: 0 0 10px #00000030;
  }

  button.secondary {
    width: auto;
    margin: 0 0 7px 0;
  }

  h1 {
    color: white;
    margin-bottom: 30px;
    margin-top: 0;
  }

  h2 {
    color: white;
    margin-bottom: 7px;
    display: flex;
    flex-direction: row;
    gap: 30px;
    align-items: center;
  }
</style>