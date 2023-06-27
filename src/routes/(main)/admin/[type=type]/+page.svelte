<script lang="ts">
  import type { PageData } from './$types'
  import AdminList from '$components/lists/AdminList.svelte'

  export let data: PageData
</script>

<svelte:head>
  <title>Emissions de radio - Administration • Le JDL - La Roche</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<h2>
  <a href="/admin">Espace administration</a>&nbsp;&nbsp;<i class="fa-solid fa-caret-right" />&nbsp; Gérer la Webradio et ses podcasts
</h2>

{#each data.shows || [] as element}
  <AdminList {element} />
{:else}
  <p>Aucune émission</p>
{/each}
