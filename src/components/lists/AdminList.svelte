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
  import io from '$services/api/socket.service'
  import type { Authorization } from '$models/data/authorization.model'

  export let element: WebradioShow | Video | Article
  export let data: PageData
  export let showAddEditModal: boolean
  export let action: { action: 'add' } | { action: 'edit'; element: WebradioShow | Video | Article }

  export let showAddEditAuthorizationModal: boolean
  export let authorizationModalElement: WebradioShow | Video | Article
  export let authorizationModalType: 'emissions' | 'videos' | 'articles'
  export let authorizationModalAction: { action: 'add' } | { action: 'edit'; authorization: Authorization }

  const content = new ContentService()
  const apiWebradio = new ApiWebradioService()
  const apiVideos = new ApiVideosService()
  const apiArticles = new ApiArticlesService()

  $: disabledShow =
    data.type === 'emissions'
      ? data.data?.find((show: WebradioShow | Video | Article) => 'streamId' in show && (show.status === -1 || show.status === 0))
      : null
  $: disabled =
    data.type === 'emissions' &&
    data.data?.find((show: WebradioShow | Video | Article) => 'streamId' in show && (show.status === -1 || show.status === 0))
      ? true
      : false
  $: title = disabled ? 'Une émission est déjà en cours' : undefined
  $: viewersCounter = 0

  $: if ('streamId' in element && (element.status === -1 || element.status === 0)) {
    io.emit('getViewers')
  }

  io.on('updateViewers', (viewers: number) => {
    viewersCounter = viewers
  })

  async function startWaitStream(show: WebradioShow | Video | Article) {
    if (
      'streamId' in show &&
      confirm(`Êtes-vous sûr de vouloir commencer l'émission "${show.title}" ?\n(Le direct sera en attente de démarrage.)`)
    ) {
      ;(await apiWebradio.putShow({ status: -1 }, show.id || 0)).subscribe({
        next: (res) => {
          data.data = res.body.data?.shows || []
          io.emit('launchWaitStream')
        },
        error: () => {}
      })
    }
  }

  async function startLiveStream(show: WebradioShow | Video | Article) {
    if ('streamId' in show) {
      ;(await apiWebradio.putShow({ status: 0 }, show.id || 0)).subscribe({
        next: (res) => {
          data.data = res.body.data?.shows || []
          io.emit('launchLiveStream')
        },
        error: () => {}
      })
    }
  }

  async function stopLiveStream(show: WebradioShow | Video | Article) {
    if ('streamId' in show) {
      ;(await apiWebradio.putShow({ status: 1 }, show.id || 0)).subscribe({
        next: (res) => {
          data.data = res.body.data?.shows || []
          io.emit('stopLiveStream')
        },
        error: () => {}
      })
    }
  }

  async function publishPodcast(show: WebradioShow | Video | Article) {
    if ('streamId' in show) {
      ;(await apiWebradio.putShow({ status: 2 }, show.id || 0)).subscribe({
        next: (res) => {
          data.data = res.body.data?.shows || []
        },
        error: () => {}
      })
    }
  }

  async function publishElement(element: WebradioShow | Video | Article) {
    if ('type' in element) {
      ;(await apiVideos.putVideo({ status: 2 }, element.id || 0)).subscribe({
        next: (res) => {
          data.data = res.body.data?.videos || []
        },
        error: () => {}
      })
    } else if ('article' in element) {
      ;(await apiArticles.putArticle({ status: 2 }, element.id || 0)).subscribe({
        next: (res) => {
          data.data = res.body.data?.articles || []
        },
        error: () => {}
      })
    }
  }

  async function deleteElement(element: WebradioShow | Video | Article) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${element.title}" ?`)) {
      return
    }
    if ('streamId' in element) {
      ;(await apiWebradio.deleteShow(element.id || 0)).subscribe({
        next: (res) => {
          data.data = res.body.data?.shows || []
        },
        error: () => {}
      })
    } else if ('type' in element) {
      ;(await apiVideos.deleteVideo(element.id || 0)).subscribe({
        next: (res) => {
          data.data = res.body.data?.videos || []
        },
        error: () => {}
      })
    } else if ('article' in element) {
      ;(await apiArticles.deleteArticle(element.id || 0)).subscribe({
        next: (res) => {
          data.data = res.body.data?.articles || []
        },
        error: () => {}
      })
    }
  }
</script>

<div class="element">
  <div class="left">
    <img src={`${api}/public/images/thumbnails/${element.thumbnail}`} alt={element.title} />
    <p class="info">
      <span class="optional">
        {#if 'streamId' in element}
          {element.status === -2
            ? 'Brouillon'
            : element.status === -1
            ? 'En attente'
            : element.status === 0
            ? 'En direct'
            : element.status === 1
            ? 'En vérification'
            : 'Publié'}&nbsp;&nbsp;•&nbsp;
        {:else if 'category' in element}
          {element.status === -2 ? 'Brouillon' : 'Publié'}&nbsp;&nbsp;• &nbsp;{utils.categoryToString(
            element.category
          )}&nbsp;&nbsp;•&nbsp;
        {/if}
      </span>
      {utils.timestampToString(+element.date)}
      {#if 'article' in element}
        <span class="optional">&nbsp;•&nbsp;&nbsp;{element.views || 0} vues</span>
      {:else if 'streamId' in element && (element.status === -1 || element.status === 0)}
        <span class="optional">&nbsp;•&nbsp;&nbsp;{viewersCounter + (viewersCounter < 2 ? ' auditeur' : ' auditeurs')}</span>
      {/if}
    </p>
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
      <button
        class="secondary"
        on:click={() => {
          showAddEditModal = true
          action = { action: 'edit', element }
        }}
      >
        <i class="fa-solid fa-pencil" />
      </button>
      <button
        class="secondary"
        on:click={() => {
          let a = (data.authorizations || []).find(
            (a) =>
              (a.elementType ===
                (authorizationModalType === 'emissions' ? 'show' : authorizationModalType === 'videos' ? 'video' : 'article') &&
                a.elementId === element.id) ||
              0
          )
          authorizationModalElement = element
          if ('streamId' in element) authorizationModalType = 'emissions'
          else if ('type' in element) authorizationModalType = 'videos'
          else if ('article' in element) authorizationModalType = 'articles'
          if (a) authorizationModalAction = { action: 'edit', authorization: a }
          else authorizationModalAction = { action: 'add' }
          showAddEditAuthorizationModal = true
        }}
      >
        <i class="fa-solid fa-file-circle-check" />
      </button>
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
    {#if 'streamId' in element}
      {#if element.status === -2}
        <button class="secondary grey" on:click={() => startWaitStream(element)} {disabled} {title}>
          <i class="fa-solid fa-video" />Commencer
        </button>
      {:else if element.status === -1}
        <button
          class="secondary red"
          on:click={() => startLiveStream(element)}
          disabled={disabled && element.id !== disabledShow?.id}
          title={disabled && element.id !== disabledShow?.id ? title : ''}
        >
          <i class="fa-solid fa-video" />Démarrer
        </button>
      {:else if element.status === 0}
        <button class="secondary red flash" on:click={() => stopLiveStream(element)}>
          <i class="fa-solid fa-video-slash" />Arrêter
        </button>
      {:else if element.status === 1}
        {#if !element.podcastId}
          <button
            class="secondary green"
            on:click={() => publishPodcast(element)}
            disabled
            title="Il manque un ID de podcast pour cette émission"
          >
            <i class="fa-solid fa-check" />Publier
          </button>
        {:else}
          <button class="secondary green" on:click={() => publishPodcast(element)}>
            <i class="fa-solid fa-check" />Publier
          </button>
        {/if}
      {/if}
    {:else if 'status' in element && element.status === -2}
      <button class="secondary green" on:click={() => publishElement(element)}>
        <i class="fa-solid fa-check" />Publier
      </button>
    {/if}
  </div>
</div>

<style lang="scss">
  div.element {
    position: relative;
    flex: 1;
    overflow: hidden;
    margin-bottom: 20px;
    padding: 30px;
    border: 1px solid var(--light-gray-color);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    gap: 15px;

    div.left {
      flex: 1;
    }

    img {
      height: 90px;
      width: calc(90px * 16 / 9);
      margin-right: 15px;
      float: left;
      border-radius: 5px;
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

      span.optional {
        display: none;
      }
    }

    p.content {
      display: none;
      color: var(--dark-gray-color);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  div.actions {
    display: flex;
    flex-direction: row;
    gap: 15px;

    div.edit {
      display: flex;
      flex-direction: row;
      gap: 15px;

      button.secondary {
        margin: 0;
        width: 31px;
        height: 31px;
      }
    }

    button.secondary {
      height: 31px;
      margin-top: 0;

      i.fa-solid {
        display: inline-block;
        margin-right: 10px;
      }
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

      p.info {
        span.optional {
          display: inline;
        }
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
      flex-direction: column;

      button.red,
      button.green,
      button.grey {
        height: 100%;

        i.fa-solid {
          display: block;
          margin-bottom: 3px;
          margin-right: 0;
        }

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
