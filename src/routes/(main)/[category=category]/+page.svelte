<script lang="ts">
  import type { PageData } from './$types'
  import List from '$components/lists/List.svelte'
  import FilterModal from '$components/modals/FilterModal.svelte'

  export let data: PageData

  let showFilterModal = false
</script>

<svelte:head>
  <title>{data.category.name} • Le JDL - La Roche</title>
</svelte:head>

{#if data.category.id !== 'radio'}
  <button class="filter" on:click={() => (showFilterModal = true)}>
    <i class="fa-solid fa-filter" />&nbsp;&nbsp;Filtrer et Trier
  </button>
{/if}
<h2><i class={'fa-solid ' + data.category.icon} style={'color: ' + data.category.color} />{data.category.name}</h2>

<List elements={data.data} />

<FilterModal bind:show={showFilterModal} />

<style lang="scss">
  h2 {
    padding-left: 45px;
    position: relative;

    i.fa-solid {
      display: inline-block;
      position: absolute;
      font-size: 32px;
      left: 0;
      top: -3px;
    }
  }

  button.filter {
    position: relative;
    width: auto;
    top: -5px;
    z-index: 10;
    padding: 10px;
    border-radius: 3px;
    border: none;
    background-color: var(--mid-gray-color);
    float: right;
    display: block;
    outline: none;
    transition: all 0.3s;
    cursor: pointer;
    color: black;

    &:disabled {
      background-color: var(--light-gray-color);
      cursor: not-allowed;
    }

    &:hover {
      background-color: var(--mid2-gray-color);

      &:active {
        background-color: var(--light-gray-color);
        color: black;
      }
    }
  }
</style>
