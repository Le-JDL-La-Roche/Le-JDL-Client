<script lang="ts">
  import type { Video } from '$models/features/video.model'
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import UrlService from '$services/url.service'
  import { api } from '$services/store'
  import type { Article } from '$models/features/article.model'
  import utils from '$services/utils'
  import ContentService from '$services/content.service'

  export let main: boolean = false
  export let element: WebradioShow | Video | Article
  export let type: 'podcast' | 'video' | 'article'

  const content = new ContentService()
  const url = new UrlService()

  if (!element || !type) {
    throw new Error('No element provided')
  }

  if ('description' in element) {
    element.description = content.replaceNewLineByBr(element.description)
  }

  $: category =
    'category' in element
      ? utils.categoriesFr[element.category as 'actualites' | 'culture' | 'sport' | 'sciences' | 'tech' | 'laroche'].slug
      : ''

  $: href =
    'category' in element
      ? `/${category}/${type}/${url.idToSlug(element.id || 0)}--${url.slugify(element.title)}`
      : `/radio/podcast/${url.idToSlug(element.id || 0)}--${url.slugify(element.title)}`
</script>

<a {href} class="element not-a" class:main>
  {#if type === 'podcast' || type === 'video'}
    <i class="fa-solid fa-circle-play" />
  {/if}
  <img src={`${api}/public/images/thumbnails/${element.thumbnail}`} alt={element.title} />
  {#if 'category' in element}
    <p class="info">{utils.categoryToString(element.category)}&nbsp;&nbsp•&nbsp;&nbsp{utils.timestampToString(+element.date)}</p>
  {:else}
    <p class="info">{utils.timestampToString(+element.date)}</p>
  {/if}
  <p class="title"><span class="like-a">{element.title}</span></p>

  <p class="content">
    {#if 'article' in element}
      {@html content.getChapo(element.article)}
    {:else if 'description' in element}
      {@html content.replaceNewLineByBr(content.markdownToHtml(element.description))}
    {/if}
  </p>
</a>

<style lang="scss">
  a.element {
    display: block;
    position: relative;
    flex: 1;
    overflow: hidden;
    margin-bottom: 20px;

    &:not(.main) {
      height: 90px;

      img {
        height: 90px;
        width: calc(90px * 16 / 9);
        margin-right: 15px;
        float: left;
      }

      i.fa-solid {
        position: absolute;
        font-size: 36px;
        top: calc(50% - 18px);
        left: calc(90px * 16 / 9 / 2 - 18px);
      }

      p.title {
        font-size: 18px;
        max-height: 60px;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }

      p.info {
        font-size: 13px;
      }

      p.content {
        display: none;
      }
    }

    img {
      border-radius: 5px;
      width: 100%;
      margin-bottom: 15px;
    }

    i.fa-solid {
      position: absolute;
      font-size: 48px;
      top: calc((100vw - 25px) * 9 / 16 / 2 - 24px);
      left: calc(50% - 24px);
      color: rgba(170, 165, 165, 0.7);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      transition: all 0.3s;
      border-radius: 50rem;
    }

    p.title {
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 5px 0;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      max-height: 30px;
      line-clamp: 1;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }

    p.info {
      font-size: 14px;
      color: var(--dark-gray-color);
      margin: 0 7px 3px 0;
    }

    p.content {
      color: var(--dark-gray-color);
      margin-top: 0;
      margin-bottom: 0;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      max-height: 100px;
      line-clamp: 4;
      -webkit-line-clamp: 4;
      overflow: hidden;
    }
  }

  @media screen and (min-width: 850px) {
    a.element {
      &:not(.main) {
        height: 100px;

        img {
          height: 100px;
          width: calc(100px * 16 / 9);
        }

        i.fa-solid {
          font-size: 36px;
          left: calc(100px * 16 / 9 / 2 - 16px);
        }

        p.content {
          display: block;
        }
      }

      &:hover {
        i.fa-solid {
          color: var(--primary-red-color);
        }

        span.like-a {
          color: var(--primary-red-color);
          border-bottom: 1px solid;
        }

        &:active {
          span.like-a {
            color: var(--dark-gray-color);
          }
        }
      }

      p.title {
        max-height: 30px;
        line-clamp: 1;
        -webkit-line-clamp: 1;
      }

      i.fa-solid {
        top: calc(220px / 2 - 18px);
      }

      p.content {
        height: 47px !important;
        line-clamp: 2 !important;
        -webkit-line-clamp: 2 !important;
      }
    }

    @media screen and (min-width: 1150px) {
      a.element {
        &:not(.main) {
          height: 147px;

          img {
            height: 147px;
            width: calc(147px * 16 / 9);
          }

          i.fa-solid {
            font-size: 36px;
            left: calc(147px * 16 / 9 / 2 - 16px);
          }
        }

        i.fa-solid {
          top: calc(304px / 2 - 18px);
        }

        p.content {
          height: 95px !important;
          line-clamp: 4 !important;
          -webkit-line-clamp: 4 !important;
        }
      }
    }
  }
</style>
