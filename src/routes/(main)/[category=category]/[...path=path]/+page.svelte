<script lang="ts">
  import type { PageData } from './$types'
  import ContentService from '$services/content.service'
  import utils from '$services/utils'
  import { api } from '$services/store'

  export let data: PageData

  const content = new ContentService()
</script>

<article>
  {#if 'category' in data.data}
    <p class="info">
      {utils.categoryToString(data.data.category)}&nbsp;&nbsp•&nbsp;&nbsp{utils.timestampToString(+data.data.date)}
    </p>
  {:else}
    <p class="info">{utils.timestampToString(+data.data.date)}</p>
  {/if}
  <h2>{data.data.title}</h2>

  {#if 'article' in data.data}
    <p class="chapo">{@html content.getChapo(data.data.article)}</p>
  {/if}

  {#if 'thumbnail' in data.data && 'thumbnailSrc' in data.data}
    <figure class="thumbnail">
      <img src={`${api}/public/images/thumbnails/${data.data.thumbnail}`} alt={data.data.title} />
      <figcaption><p><i>Source : {data.data.thumbnailSrc}</i></p></figcaption>
    </figure>
  {/if}

  <p class="article">
    {#if 'article' in data.data}
      {@html content.markdownToHtml(data.data.article)}
    {:else if 'description' in data.data}
      {@html content.markdownToHtml(data.data.description)}
    {/if}
  </p>
</article>

<style lang="scss">
  h2 {
    font-size: 36px;
    margin-top: 5px;
  }

  p.info {
    font-size: 14px;
    color: var(--dark-gray-color);
    margin: 0 7px 3px 0;
  }

  p.chapo {
    font-size: 20px;
    width: auto;
  }

  article {
    figure.thumbnail {
      width: 100%;
      display: block;
      margin: 0 0 40px 0;

      img {
        width: calc(100vw - 25px);
        border-radius: 5px !important;
      }

      figcaption {
        color: #666666;
        text-align: center;

        p {
          margin: 0;
          text-align: right;
          font-size: 14px;
        }
      }
    }

    p.article {
      width: auto;
      margin-left: 0;

      h4 {
        display: inline;
        font-size: 21px;
        padding: 5px 0 0 0;
      }
    }
  }

  p.author {
    text-align: right;
    margin-top: 35px;
    color: #666666;
    width: 100%;
  }

  @media screen and (min-width: 850px) {
    p.chapo {
      width: 700px;
    }

    article {
      figure.thumbnail {
        width: 700px;

        img {
          width: 700px;
        }
      }

      p.article {
        width: 500px;
        margin-left: 75px;
      }
    }

    p.author {
      width: 575px;
    }

    @media screen and (min-width: 1150px) {
      p.chapo {
        width: 900px;
      }

      article {
        figure.thumbnail {
          width: 900px;

          img {
            width: 900px;
          }
        }

        p.article {
          width: 700px;
          margin-left: 100px;
        }
      }

      p.author {
        width: 800px;
      }
    }
  }
</style>
