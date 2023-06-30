<script lang="ts">
  import type { PageData } from './$types'
  import ContentService from '$services/content.service'
  import utils from '$services/utils'
  import { api } from '$services/store'
  import InstagramVideo from '$components/players/InstagramVideo.svelte'
  import AushaPlayer from '$components/players/AushaPlayer.svelte'
  import { error } from '@sveltejs/kit'

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

<article>
  {#if 'category' in data.data}
    <p class="info">
      {utils.categoryToString(data.data.category)}&nbsp;&nbsp•&nbsp;&nbsp{utils.timestampToString(
        +data.data.date
      )}&nbsp;&nbsp•&nbsp;&nbspPar {'author' in data.data ? data.data.author : 'Le JDL'}
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
  {:else if 'videoId' in data.data}
    {#if data.data.type === 'youtube'}
      <figure class="video">
        <iframe
          width="100%"
          height="auto"
          src={`https://www.youtube.com/embed/${data.data.videoId}`}
          frameborder="0"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
      </figure>
    {:else if data.data.type === 'instagram'}
      <InstagramVideo videoId={data.data.videoId} />
    {/if}
  {:else if 'podcastId' in data.data}
    <AushaPlayer podcastId={data.data.podcastId} />
  {/if}

  <p class="article">
    {@html content.markdownToHtml('article' in data.data ? data.data.article : data.data.description)}
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
    figure.thumbnail,
    figure.video {
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

    figure.video {
      width: calc(100vw - 25px);
      height: calc((100vw - 25px) * 9 / 16);

      iframe {
        width: calc(100vw - 25px);
        height: calc((100vw - 25px) * 9 / 16);
        border-radius: 5px;
      }
    }

    p.article {
      width: auto;
      margin-left: 0;
    }
  }

  @media screen and (min-width: 850px) {
    p.chapo {
      width: 700px;
    }

    article {
      figure.thumbnail,
      figure.video {
        width: 700px;

        img,
        iframe {
          width: 700px;
        }
      }

      figure.video {
        height: calc(700px * 9 / 16);

        iframe {
          height: calc(700px * 9 / 16);
        }
      }

      p.article {
        width: 500px;
        margin-left: 75px;
      }
    }

    @media screen and (min-width: 1150px) {
      p.chapo {
        width: 900px;
      }

      article {
        figure.thumbnail,
        figure.video {
          width: 900px;

          img,
          iframe {
            width: 900px;
          }
        }

        figure.video {
          height: calc(900px * 9 / 16);

          iframe {
            height: calc(900px * 9 / 16);
          }
        }

        p.article {
          width: 700px;
          margin-left: 100px;
        }
      }
    }
  }
</style>
