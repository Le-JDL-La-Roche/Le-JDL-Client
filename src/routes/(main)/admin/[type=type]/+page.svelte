<script lang="ts">
  import type { PageData } from './$types'
  import AdminList from '$components/lists/AdminList.svelte'
  import AddEditElementModal from '$components/modals/AddEditElementModal.svelte'
  import AddEditAuthorizationModal from '$components/modals/AddEditAuthorizationModal.svelte'
  import type { Article } from '$models/features/article.model'
  import type { Video } from '$models/features/video.model'
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import type { Authorization } from '$models/data/authorization.model'
  import AuthorizationRefusalModal from '$components/modals/AuthorizationRefusalModal.svelte'

  export let data: PageData

  let type = data.type as 'emissions' | 'videos' | 'articles'

  let showAddEditModal = false
  let action: { action: 'add' } | { action: 'edit'; element: WebradioShow | Video | Article }

  let showAddEditAuthorizationModal = false
  let authorizationModalElement: WebradioShow | Video | Article
  let authorizationModalType = type
  let authorizationModalAction: { action: 'add' } | { action: 'edit'; authorization: Authorization }

  $: shows = data && data.data && 'streamId' in data.data[0] ? (data.data as WebradioShow[]) : undefined
</script>

<svelte:head>
  <title>
    {data.type === 'emissions' ? 'Emissions' : data.type === 'videos' ? 'Vidéos' : 'Articles'} - Administration • Le JDL -
    La Roche
  </title>
  <meta name="robots" content="noindex" />
</svelte:head>

<h2>
  <a href="/admin">Espace administration</a>&nbsp;&nbsp;<i class="fa-solid fa-caret-right" />&nbsp;
  {#if data.type === 'emissions'}
    Gérer les émissions
  {:else if data.type === 'videos'}
    Gérer les vidéos
  {:else}
    Gérer les articles
  {/if}
</h2>

<div class="main-action">
  <button
    class="primary"
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
  {#if data.type === 'emissions' && shows && shows.find((data) => (data.status === -1 || data.status === 0))}
    <a class="not-a" href="/admin/emissions/prompteur"><button class="secondary"><i class="fa-solid fa-align-left" /></button></a>
    <a class="not-a" href="/admin/emissions/presentateur"><button class="secondary"><i class="fa-solid fa-gear" /></button></a>
  {/if}
</div>

{#each data.data || [] as element}
  <AdminList
    {element}
    bind:data
    bind:showAddEditModal
    bind:action
    bind:showAddEditAuthorizationModal
    bind:authorizationModalElement
    bind:authorizationModalType
    bind:authorizationModalAction
  />
{:else}
  {#if data.type === 'emissions'}
    Aucune émission
  {:else if data.type === 'videos'}
    Aucune vidéos
  {:else}
    Aucun articles
  {/if}
{/each}

<AddEditElementModal
  bind:show={showAddEditModal}
  bind:data
  {action}
  {type}
  bind:showAddEditAuthorizationModal
  bind:authorizationModalElement
  bind:authorizationModalType
  bind:authorizationModalAction
/>
<AddEditAuthorizationModal
  bind:show={showAddEditAuthorizationModal}
  bind:data
  bind:element={authorizationModalElement}
  bind:type={authorizationModalType}
  bind:action={authorizationModalAction}
/>

<style lang="scss">
  div.main-action {
    display: flex;
    flex-direction: row;
    gap: 15px;

    button.primary {
      flex: 1 1 74%;
      margin: 0 0 30px 0;
    }

    a {
      flex: 1 1 13%;
      height: 37px;

      button {
        height: 37px;
        margin: 0 0 30px 0;
      }
    }
  }
</style>
