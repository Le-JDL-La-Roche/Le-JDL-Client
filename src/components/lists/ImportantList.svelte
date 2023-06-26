<script lang="ts">
  import type { Video } from '$models/features/video.model'
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import UrlService from '$services/url.service'
  import type { Article } from '$models/features/article.model'
  import ListElement from './ListElement.svelte'

  export let shows: WebradioShow[] | undefined = undefined
  export let videos: Video[] | undefined = undefined
  export let articles: Article[] | undefined = undefined

  const type = shows ? 'podcast' : videos ? 'video' : articles ? 'article' : null

  const elements: WebradioShow[] | Video[] | Article[] | undefined = shows || videos || articles

  if (!elements || !type) {
    throw new Error('No element provided')
  }
</script>

<div class="flex">
  <ListElement element={elements[0]} {type} main />
  <div class="side">
    {#each elements.slice(1, 4) as element}
      <ListElement {element} {type} />
    {/each}
  </div>
</div>

<style lang="scss">
  div.flex {
    display: flex;
    flex-direction: column;
    flex: auto;
    gap: 20px;
  }

  div.side {
    flex: 1;
  }

  @media screen and (min-width: 850px) {
    div.flex {
      flex-direction: row;
    }
  }
</style>
