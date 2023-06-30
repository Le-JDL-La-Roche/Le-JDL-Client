<script lang="ts">
  import type { PageData } from './$types'
  import AdminList from '$components/lists/AdminList.svelte'

  export let data: PageData
</script>

<svelte:head>
  <title>
    {data.type === 'emissions' ? 'Emissions de radio' : data.type === 'videos' ? 'Vidéos' : 'Articles'} - Administration • Le JDL -
    La Roche
  </title>
  <meta name="robots" content="noindex" />
</svelte:head>

<h2>
  <a href="/admin">Espace administration</a>&nbsp;&nbsp;<i class="fa-solid fa-caret-right" />&nbsp;
  {#if data.type === 'emissions'}
    Gérer les émissions de radio et podcasts
  {:else if data.type === 'videos'}
    Gérer les vidéos
  {:else}
    Gérer les articles
  {/if}
</h2>

{#if data.type === 'emissions'}
  <a href="/admin/emissions/add" class="not-a">
    <button class="primary" style="margin-bottom: 30px">
      <i class="fa-solid fa-plus" />&nbsp;&nbsp;Ajouter une émission
    </button>
  </a>
{:else if data.type === 'videos'}
  <a href="/admin/videos/add" class="not-a">
    <button class="primary" style="margin-bottom: 30px">
      <i class="fa-solid fa-plus" />&nbsp;&nbsp;Ajouter une vidéo
    </button>
  </a>
{:else}
  <a href="/admin/articles/add" class="not-a">
    <button class="primary" style="margin-bottom: 30px">
      <i class="fa-solid fa-plus" />&nbsp;&nbsp;Ajouter un article
    </button>
  </a>
{/if}

{#each data.data || [] as element}
  <AdminList {element} bind:data />
{:else}
  {#if data.type === 'emissions'}
    Aucune émission ou podcast
  {:else if data.type === 'videos'}
    Aucune vidéos
  {:else}
    Aucun articles
  {/if}
{/each}
