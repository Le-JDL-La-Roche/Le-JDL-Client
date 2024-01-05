<script lang="ts">
  import type { PageData } from './$types'
  import ContentService from '$services/content.service'
  import Post from '$components/others/Post.svelte'
  import { api } from '$services/store'
  import utils from '$services/utils'

  export let data: PageData

  const content = new ContentService()
</script>

<svelte:head>
  <title>{data.data.title} • Le JDL - La Roche</title>

  <meta name="title" content={data.data.title} />
  <meta name="twitter:title" content={data.data.title} />
  <meta property="og:title" content={data.data.title} />

  <meta name="description" content={'article' in data.data ? content.getChapo(data.data.article) : data.data.description} />
  <meta name="twitter:description" content={'article' in data.data ? content.getChapo(data.data.article) : data.data.description} />
  <meta property="og:description" content={'article' in data.data ? content.getChapo(data.data.article) : data.data.description} />

  <meta name="date" content={utils.timestampToString(+data.data.date || 0)} />
  <meta name="twitter:date" content={utils.timestampToString(+data.data.date || 0)} />
  <meta property="og:date" content={utils.timestampToString(+data.data.date || 0)} />

  {#if 'author' in data.data}
    <meta name="author" content={data.data.author} />
    <meta name="twitter:author" content={data.data.author} />
    <meta property="og:author" content={data.data.author} />
  {/if}

  <meta name="image" content={`${api}/public/images/thumbnails/${data.data.thumbnail}`} />
  <meta name="twitter:image" content={`${api}/public/images/thumbnails/${data.data.thumbnail}`} />
  <meta property="og:image" content={`${api}/public/images/thumbnails/${data.data.thumbnail}`} />
</svelte:head>

<Post {data} />
