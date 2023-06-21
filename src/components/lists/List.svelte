<script lang="ts">
  import type { Video } from '$models/features/video.model'
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import type { Article } from '$models/features/article.model'
  import ListElement from './ListElement.svelte'

  export let shows: WebradioShow[] | undefined = undefined
  export let videos: Video[] | undefined = undefined
  export let articles: Article[] | undefined = undefined

  const type = shows ? 'radio' : videos ? 'video' : articles ? 'article' : null

  const elements: WebradioShow[] | Video[] | Article[] | undefined = shows || videos || articles

  if (!elements || !type) {
    throw new Error('No element provided')
  }
</script>

{#each elements as element}
  <ListElement {element} {type} />
{/each}
