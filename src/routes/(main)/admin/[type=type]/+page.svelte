<script lang="ts">
  import type { PageData } from './$types'
  import AdminList from '$components/lists/AdminList.svelte'
  import AddEditElementModal from '$components/modals/AddEditElementModal.svelte'
  import type { Article } from '$models/features/article.model'
  import type { Video } from '$models/features/video.model'
  import type { WebradioShow } from '$models/features/webradio-show.model'

  export let data: PageData

  let showAddEditModal = false
  let action: { action: 'add' } | { action: 'edit'; element: WebradioShow | Video | Article }
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

<button
  class="primary"
  style="margin-bottom: 30px"
  on:click={() => {
    showAddEditModal = true
    action = { action: 'add' }
  }}
>
  {#if data.type === 'emissions'}
    <i class="fa-solid fa-plus" />&nbsp;&nbsp;Ajouter une émission
  {:else if data.type === 'videos'}
    <i class="fa-solid fa-plus" />&nbsp;&nbsp;Ajouter une vidéo
  {:else}
    <i class="fa-solid fa-plus" />&nbsp;&nbsp;Ajouter un article
  {/if}
</button>

{#each data.data || [] as element}
  <AdminList {element} bind:data bind:showAddEditModal bind:action />
{:else}
  {#if data.type === 'emissions'}
    Aucune émission ou podcast
  {:else if data.type === 'videos'}
    Aucune vidéos
  {:else}
    Aucun articles
  {/if}
{/each}

<AddEditElementModal type={data.type} bind:show={showAddEditModal} {action} />
