<script lang="ts">
  import type { Video } from '$models/features/video.model'
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import type { Article } from '$models/features/article.model'
  import ListElement from './ListElement.svelte'

  export let shows: WebradioShow[] | undefined = undefined
  export let videos: Video[] | undefined = undefined
  export let articles: Article[] | undefined = undefined
  export let elements: (WebradioShow | Video | Article)[] | undefined = undefined

  $: elements = shows || videos || articles || elements
</script>

{#each elements || [] as element}
  <ListElement {element} type={'streamId' in element ? 'podcast' : 'type' in element ? 'video' : 'article'} />
{:else}
  <p>Aucun élément</p>
{/each}
