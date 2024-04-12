<script lang="ts">
  import ApiInfoService from '$services/api/api-info.service'
  import type { PageData } from './$types'
  import AddEditInfoModal from '$components/modals/AddEditInfoModal.svelte'
  import type { Info } from '$models/features/info.model'
  import ContentService from '$services/content.service'
  import { onMount } from 'svelte'

  export let data: PageData

  const apiInfo = new ApiInfoService()
  const content = new ContentService()

  let showAddEditModal = false
  let action: { action: 'add' } | { action: 'edit'; element: Info }

  let style: HTMLStyleElement[] = []

  onMount(() => {
    style.forEach((element, i) => {
      element.innerHTML = content.addPrefixToStyle(data.data[i].css, '.info-selector-isolation')
    });
  })

  $: if (data.data && style[0]) {
    style.forEach((element, i) => {
      element.innerHTML = content.addPrefixToStyle(data.data[i].css, '.info-selector-isolation')
    });
  }

  async function deleteInfo(element: Info) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'information ?`)) {
      return
    }
    ;(await apiInfo.deleteInfo(element.id || 0)).subscribe({
      next: (res) => {
        data.data = res.body.data?.info || []
      },
      error: () => {}
    })
  }

  async function putSelectInfo(info: Info, e: MouseEvent) {
    info.enabled = true
    ;(await apiInfo.putInfo(info, info.id || 0)).subscribe({
      next: (res) => {
        data.data = res.body.data?.info || []
      },
      error: () => {}
    })
  }

  async function putResetInfo() {
    ;(await apiInfo.putResetInfo()).subscribe({
      next: (res) => {
        data.data = res.body.data?.info || []
      },
      error: () => {}
    })
  }
</script>

<svelte:head>
  <title>Informations - Administration • Le JDL - La Roche</title>
</svelte:head>

<h2>
  <a href="/admin">Espace administration</a>&nbsp;&nbsp;<i class="fa-solid fa-caret-right" />&nbsp; Gérer les informations
</h2>

<button
  class="primary"
  style="margin-bottom: 30px"
  on:click={() => {
    action = { action: 'add' }
    showAddEditModal = true
  }}
>
  <i class="fa-solid fa-plus" />&nbsp;&nbsp;Ajouter une information
</button>
<small style="position: relative; top: -30px">
  <i><b>Attention !</b> Les informations ne sont à utiliser que dans des cas spécifiques. Ce n'est pas un agenda.</i>
</small>

<div class="container">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="element" class:enabled={!data.data.find((e) => e.enabled == true)} on:click={putResetInfo} style="height: auto; min-height: auto">
    Aucune information à la Une.
  </div>
  {#each data.data || [] as info, i}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="element" class:enabled={info.enabled} on:click={(e) => putSelectInfo(info, e)}>
      <div class="left info-selector-isolation">
        {@html content.markdownToHtml(info.html, false)}
        <style bind:this={style[i]}>
        </style>
      </div>
      <div class="actions">
        <div class="edit">
          <button
            class="secondary"
            on:click|stopPropagation={() => {
              showAddEditModal = true
              action = { action: 'edit', element: info }
            }}
          >
            <i class="fa-solid fa-pencil" />
          </button>
          <button class="secondary" on:click|stopPropagation={() => deleteInfo(info)}><i class="fa-solid fa-trash" /></button>
        </div>
      </div>
    </div>
  {/each}
</div>

<AddEditInfoModal bind:show={showAddEditModal} {action} bind:data />

<style lang="scss">
  div.element {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--mid-gray-color);
    padding: 30px;
    min-height: 100px;
    border-radius: 5px;
    margin-bottom: 20px;
    gap: 30px;
    cursor: pointer;
    transition: all 0.2s;

    &.enabled {
      outline: 3px solid var(--primary-red-color);
    }

    div.left {
      display: flex;
      flex-direction: row;
      flex: 1;
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
    div.element {
      flex-direction: row;

      &.enabled:hover {
        outline: 3px solid var(--secondary-red-color);

        &:active {
          outline: 3px solid var(--light-gray-color);
        }
      }

      &:not(.enabled):hover {
        border: 1px solid var(--primary-red-color);

        &:active {
          border: 1px solid var(--light-gray-color);
        }
      }
    }

    div.actions {
      text-align: right;
      flex-direction: column;
    }
  }
</style>
