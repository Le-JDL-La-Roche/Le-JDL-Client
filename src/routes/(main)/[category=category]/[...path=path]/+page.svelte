<script lang="ts">
  import type { PageData } from './$types'
  import ContentService from '$services/content.service'
  import Post from '$components/lists/Post.svelte'

  export let data: PageData

  const content = new ContentService()
</script>

<svelte:head>
  <title>{data.data.title} • Le JDL - La Roche</title>
  {#if 'author' in data.data}
    <meta name="author" content={data.data.author} />
  {/if}
  <meta name="description" content={'article' in data.data ? content.getChapo(data.data.article) : data.data.description} />
</svelte:head>

<Post {data} />
