<script lang="ts">
  import type { PageData } from './$types'
  import List from '$components/lists/List.svelte'

  export let data: PageData
</script>

<svelte:head>
  <title>{data.category.name} • Le JDL - La Roche</title>
</svelte:head>

<h2><i class={'fa-solid ' + data.category.icon} style={'color: ' + data.category.color} />{data.category.name}</h2>

<List elements={data.data} />

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

  input[type='checkbox'],
  input[type='radio'] {
    display: inline;
    min-width: auto;
    max-width: fit-content;
    margin-bottom: 0;
  }

  label {
    margin-bottom: 0;
  }
</style>
