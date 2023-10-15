<script lang="ts">
  import utils from '$services/utils'
  import ContentService from '$services/content.service'
  import { api } from '$services/store'
  import InstagramVideo from '$components/players/InstagramVideo.svelte'
  import AushaPlayer from '$components/players/AushaPlayer.svelte'
  import type { Article } from '$models/features/article.model'
  import type { Video } from '$models/features/video.model'
  import type { WebradioShow } from '$models/features/webradio-show.model'

  export let data: { data: WebradioShow | Video | Article; type: string }
  export let preview = false

  const content = new ContentService()
</script>

<article class:preview>
  {#if 'category' in data.data}
    <p class="info">
      {utils.categoryToString(data.data.category) || 'Non définie'}&nbsp;&nbsp•&nbsp;&nbsp{utils.timestampToString(
        +data.data.date
      )}&nbsp;&nbsp•&nbsp;&nbspPar {'author' in data.data && data.data.author ? data.data.author : 'Le JDL'}
    </p>
  {:else}
    <p class="info">{utils.timestampToString(+data.data.date || 0)}</p>
  {/if}
  <h2>{data.data.title}</h2>

  {#if 'article' in data.data}
    <p class="chapo">{@html content.getChapo(data.data.article) || ''}</p>
  {/if}

  {#if 'thumbnail' in data.data && 'thumbnailSrc' in data.data && data.data.thumbnail && data.data.thumbnailSrc}
    <figure class="thumbnail">
      <img src={`${api}/public/images/thumbnails/${data.data.thumbnail}`} alt={data.data.title} />
      <figcaption><p><em>Source : {data.data.thumbnailSrc}</em></p></figcaption>
    </figure>
  {:else if 'videoId' in data.data}
    {#if data.data.type === 'youtube'}
      <figure class="video" class:preview>
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
      <figure style="text-align: center;">
        <InstagramVideo videoId={data.data.videoId} />
      </figure>
    {/if}
  {:else if 'podcastId' in data.data}
    {#if !data.data.id || data.data.id > 27}
      <p style="font-size: 18px">Retrouvez l'émission en podcast ...</p>
    {/if}
    <figure class="podcast">
      <AushaPlayer podcastId={data.data.podcastId} />
    </figure>
    {#if !data.data.id || data.data.id > 27}
      <p style="font-size: 18px">... ou en vidéo !</p>
      <figure class="video" class:preview>
        <iframe
          width="100%"
          height="auto"
          src={`https://www.youtube.com/embed/${data.data.streamId}`}
          frameborder="0"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
      </figure>
    {/if}
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
        width: 100%;
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

    figure.video:not(.preview) {
      width: 100%;
      height: calc((100vw - 25px) * 9 / 16);

      iframe {
        width: 100%;
        height: calc((100vw - 25px) * 9 / 16);
        border-radius: 5px;
      }
    }

    figure.video.preview {
      width: 100%;
      height: calc((100vw - 120px) * 9 / 16);

      iframe {
        width: 100%;
        height: calc((100vw - 120px) * 9 / 16);
        border-radius: 5px;
      }
    }

    figure.podcast {
      text-align: center;
    }

    p.article {
      width: auto;
      margin-left: 0;
    }
  }

  @media screen and (min-width: 850px) {
    figure.video.preview {
      width: calc(50vw - 95px) !important;
      height: calc((50vw - 95px) * 9 / 16) !important;

      iframe {
        width: calc(50vw - 95px);
        height: calc((50vw - 95px) * 9 / 16) !important;
        border-radius: 5px;
      }
    }

    article:not(.preview) {
      p.chapo {
        width: 700px;
      }

      figure.thumbnail,
      figure.video,
      figure.podcast {
        width: 700px;
        margin-left: 0;
        margin-right: 0;

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

      figure.podcast {
        text-align: left;
      }

      p.article {
        width: 500px;
        margin-left: 75px;
      }
    }

    @media screen and (min-width: 1150px) {
      article:not(.preview) {
        p.chapo {
          width: 900px;
        }

        figure.thumbnail,
        figure.video,
        figure.podcast {
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
