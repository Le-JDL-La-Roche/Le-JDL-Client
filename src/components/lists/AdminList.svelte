<script lang="ts">
  import type { Article } from '$models/features/article.model'
  import type { Video } from '$models/features/video.model'
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import { api } from '$services/store'
  import utils from '$services/utils'
  import ContentService from '$services/content.service'
  import ApiWebradioService from '$services/api/api-webradio.service'
  import ApiVideosService from '$services/api/api-videos.service'
  import ApiArticlesService from '$services/api/api-articles.service'
  import type { PageData } from '../../routes/(main)/admin/[type=type]/$types'

  export let element: WebradioShow | Video | Article
  export let data: PageData

  const content = new ContentService()
  const apiWebradio = new ApiWebradioService()
  const apiVideos = new ApiVideosService()
  const apiArticles = new ApiArticlesService()

  $: disabled =
    data.type === 'emissions' && data.data?.find((show: WebradioShow | Video | Article) => 'status' in show && show.status === 0)
      ? true
      : false
  $: title = disabled ? 'Une émission est déjà en cours' : undefined

  async function startLivestream(show: WebradioShow | Video | Article) {
    if ('status' in show) {
      ;(await apiWebradio.putShow({ status: 0 }, show.id || 0)).subscribe({
        next: (res) => {
          data.data = res.body.data?.shows || []
        },
        error: (resp) => {}
      })
    }
  }

  async function stopLivestream(show: WebradioShow | Video | Article) {
    if ('status' in show) {
      ;(await apiWebradio.putShow({ status: 1 }, show.id || 0)).subscribe({
        next: (res) => {
          data.data = res.body.data?.shows || []
        },
        error: (resp) => {}
      })
    }
  }

  async function publishPodcast(show: WebradioShow | Video | Article) {
    if ('status' in show) {
      ;(await apiWebradio.putShow({ status: 2 }, show.id || 0)).subscribe({
        next: (res) => {
          data.data = res.body.data?.shows || []
        },
        error: (resp) => {}
      })
    }
  }

  async function deleteElement(element: WebradioShow | Video | Article) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${element.title}" ?`)) {
      return
    }
    if ('status' in element) {
      ;(await apiWebradio.deleteShow(element.id || 0)).subscribe({
        next: (res) => {
          data.data = res.body.data?.shows || []
        },
        error: (resp) => {}
      })
    } else if ('type' in element) {
      ;(await apiVideos.deleteVideo(element.id || 0)).subscribe({
        next: (res) => {
          data.data = res.body.data?.videos || []
        },
        error: (resp) => {}
      })
    } else if ('article' in element) {
      ;(await apiArticles.deleteArticle(element.id || 0)).subscribe({
        next: (res) => {
          data.data = res.body.data?.articles || []
        },
        error: (resp) => {}
      })
    }
  }
</script>

<div class="element">
  <div class="left">
    <img src={`${api}/public/images/thumbnails/${element.thumbnail}`} alt={element.title} />
    {#if 'category' in element}
      <p class="info">
        {utils.categoryToString(element.category)}&nbsp;&nbsp•&nbsp;&nbsp{utils.timestampToString(+element.date)}
      </p>
    {:else if 'status' in element}
      <p class="info">
        {element.status === -1
          ? 'Brouillon'
          : element.status === 0
          ? 'En direct'
          : element.status === 1
          ? 'En attente'
          : 'Publié'}&nbsp;&nbsp•&nbsp;&nbsp{utils.timestampToString(+element.date)}
      </p>
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
  <div class="actions">
    <div class="edit">
      <a href={`/admin/${data.type}/${element.id}`} class="not-a">
        <button class="secondary"><i class="fa-solid fa-pencil" /></button>
      </a>
      <button class="secondary" on:click={() => deleteElement(element)}><i class="fa-solid fa-trash" /></button>
      {#if 'streamId' in element}
        <a
          href={`https://radio.le-jdl-laroche.cf:8080/download/${element.streamId}_vid_${utils.timestampToDate(
            +element.date
          )}.flv`}
          class="not-a"
          target="_blank"
        >
          <button class="secondary"><i class="fa-solid fa-download" /></button>
        </a>
      {:else if 'type' in element && element.type === 'instagram'}
        <a href={`https://instagram.com/p/${element.videoId}`} class="not-a" target="_blank">
          <button class="secondary"><i class="fa-brands fa-instagram" /></button>
        </a>
      {:else if 'type' in element && element.type === 'youtube'}
        <a href={`https://studio.youtube.com/video/${element.videoId}/edit`} class="not-a" target="_blank">
          <button class="secondary"><i class="fa-brands fa-youtube" /></button>
        </a>
      {/if}
    </div>
    {#if 'status' in element}
      {#if element.status === -1}
        <button class="secondary red" on:click={() => startLivestream(element)} {disabled} {title}>
          <i class="fa-solid fa-video" /><br />Démarrer
        </button>
      {:else if element.status === 0}
        <button class="secondary red flash" on:click={() => stopLivestream(element)}>
          <i class="fa-solid fa-video-slash" /><br />Arrêter
        </button>
      {:else if element.status === 1}
        {#if !element.podcastId}
          <button
            class="secondary green"
            on:click={() => publishPodcast(element)}
            disabled
            title="Il manque un ID de podcast pour cette émission"
          >
            <i class="fa-solid fa-check" /><br />Publier
          </button>
        {:else}
          <button class="secondary green" on:click={() => publishPodcast(element)}>
            <i class="fa-solid fa-check" /><br />Publier
          </button>
        {/if}
      {/if}
    {/if}
  </div>
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

  div.actions {
    div.edit {
      button.secondary {
        margin: 0;
        width: 31px;
        height: 31px;
      }
    }

    button.secondary {
      margin-top: 0;
    }

    button.red:not(:disabled) {
      background-color: #d63c3c;
      color: white;

      &.flash i {
        animation: flash 1s infinite;
      }
    }

    button.green:not(:disabled) {
      background-color: #3d944b;
      color: white;
    }
  }

  @media screen and (min-width: 850px) {
    div.element {
      height: 102px;
      display: flex;
      flex-direction: row;

      div.left {
        flex: 1;
      }

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

    div.actions {
      text-align: right;
      display: flex;
      flex-direction: column;
      gap: 15px;

      div.edit {
        display: flex;
        flex-direction: row;
        gap: 15px;
      }

      button.red,
      button.green {
        height: 100%;

        &:hover:active:not(:disabled) {
          background-color: var(--light-gray-color);
          color: black;
        }
      }

      button.red:hover:not(:disabled) {
        background-color: #b42c2c;
      }

      button.green:hover:not(:disabled) {
        background-color: #2f6f35;
      }
    }
  }

  @keyframes flash {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
</style>