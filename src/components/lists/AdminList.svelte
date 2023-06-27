<script lang="ts">
  import type { Article } from '$models/features/article.model'
  import type { Video } from '$models/features/video.model'
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import { api } from '$services/store'
  import utils from '$services/utils'
  import ContentService from '$services/content.service'

  export let element: WebradioShow | Video | Article

  const content = new ContentService()

  let type = 'podcastId' in element ? 'podcast' : 'type' in element ? 'video' : 'article'
</script>

<div class="element">
  <img src={`${api}/public/images/thumbnails/${element.thumbnail}`} alt={element.title} />
  {#if 'category' in element}
    <p class="info">{utils.categoryToString(element.category)}&nbsp;&nbsp•&nbsp;&nbsp{utils.timestampToString(+element.date)}</p>
  {:else}
    <p class="info">{utils.timestampToString(+element.date)}</p>
  {/if}
  <p class="title">{element.title}</p>

  <p class="content">
    {#if 'article' in element}
      {@html content.getChapo(element.article)}
    {:else if 'description' in element}
      {@html content.replaceNewLineByBr(element.description)}
    {/if}
  </p>
</div>

<style lang="scss">
  div.element {
    display: block;
    position: relative;
    flex: 1;
    overflow: hidden;
    margin-bottom: 20px;
    height: 90px;
    padding: 30px;
    border: 1px solid var(--light-gray-color);
    border-radius: 5px;

    img {
      height: 90px;
      width: calc(90px * 16 / 9);
      margin-right: 15px;
      float: left;
      border-radius: 5px;
      margin-bottom: 15px;
    }

    p.title {
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

    p.info {
      font-size: 13px;
      color: var(--dark-gray-color);
      margin: 0 7px 3px 0;
    }

    p.content {
      display: none;
      color: var(--dark-gray-color);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  @media screen and (min-width: 850px) {
    div.element {
      height: 102px;

      img {
        height: 102px;
        width: calc(102px * 16 / 9);
      }

      p.title {
        max-height: 30px;
        line-clamp: 1;
        -webkit-line-clamp: 1;
      }

      p.content {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        max-height: 100px;
        line-clamp: 4;
        -webkit-line-clamp: 4;
        overflow: hidden;
        height: 47px !important;
        line-clamp: 2 !important;
        -webkit-line-clamp: 2 !important;
      }
    }

    // @media screen and (min-width: 1150px) {
    //   div.element {
    //     height: 147px;

    //     img {
    //       height: 147px;
    //       width: calc(147px * 16 / 9);
    //     }

    //     p.content {
    //       height: 95px !important;
    //       line-clamp: 4 !important;
    //       -webkit-line-clamp: 4 !important;
    //     }
    //   }
    // }
  }
</style>
