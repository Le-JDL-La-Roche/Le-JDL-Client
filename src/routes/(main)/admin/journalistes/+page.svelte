<script lang="ts">
  import AddEditJournalistModal from '$components/modals/AddEditJournalistModal.svelte'
  import type { Journalist } from '$models/data/journalist.model'
  import ApiEnvService from '$services/api/api-env.service'
  import type { PageData } from './$types'

  export let data: PageData

  const apiEnv = new ApiEnvService()

  let showAddEditModal = false
  let action: { action: 'add' } | { action: 'edit'; element: Journalist }

  async function deleteJournalist(element: Journalist) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${element.name} de la liste des journalistes ?`)) {
      return
    }
    ;(await apiEnv.deleteJournalist(element.id || 0)).subscribe({
      next: (res) => {
        data.data = res.body.data?.journalists || []
      },
      error: () => {}
    })
  }
</script>

<svelte:head>
  <title>Journalistes • Le JDL - La Roche</title>
</svelte:head>

<h2>
  <a href="/admin">Espace administration</a>&nbsp;&nbsp;<i class="fa-solid fa-caret-right" />&nbsp; Gestion des journalistes
</h2>

<button
  class="primary"
  style="margin-bottom: 30px"
  on:click={() => {
    action = { action: 'add' }
    showAddEditModal = true
  }}
>
  <i class="fa-solid fa-plus" />&nbsp;&nbsp;Ajouter un journaliste
 </button>

<div class="container">
  {#each data.data || [] as journalist}
    <div class="element">
      <div class="left">
        <p class="name">{journalist.name}</p>
        <p class="content">{journalist.class}</p>
      </div>
      <div class="actions">
        <div class="edit">
          <button
            class="secondary"
            on:click={() => {
              showAddEditModal = true
              action = { action: 'edit', element: journalist }
            }}
          >
            <i class="fa-solid fa-pencil" />
          </button>
          <button class="secondary" on:click={() => deleteJournalist(journalist)}><i class="fa-solid fa-trash" /></button>
        </div>
      </div>
    </div>
  {:else}
    Aucun journaliste
  {/each}
</div>

<AddEditJournalistModal bind:show={showAddEditModal} {action} bind:data />

<style lang="scss">
  div.element {
    position: relative;
    flex: 1;
    overflow: hidden;
    margin-bottom: 20px;
    padding: 30px;
    border: 1px solid var(--light-gray-color);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    gap: 15px;

    div.left {
      flex: 1;
    }

    p.name {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 5px 0;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      max-height: 60px;
      line-clamp: 2;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    p.content {
      display: block;
      color: var(--dark-gray-color);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  div.actions {
    display: flex;
    flex-direction: row;
    gap: 15px;

    div.edit {
      display: flex;
      flex-direction: row;
      gap: 15px;

      button.secondary {
        margin: 0;
        width: 31px;
        height: 31px;
      }

      i.fa-solid {
        display: inline-block;
        margin-right: 10px;
      }
    }
  }

  @media screen and (min-width: 850px) {
    div.container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }

    div.element {
      flex-basis: calc(50% - 72px);
      flex-grow: 0;
      flex-direction: row;
      margin-bottom: 0;

      div.left {
        flex: 1;
      }

      p.name {
        max-height: 30px;
        line-clamp: 1;
        -webkit-line-clamp: 1;
      }
    }

    div.actions {
      text-align: right;
      flex-direction: column;
    }
  }
</style>
