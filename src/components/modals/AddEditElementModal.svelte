<script lang="ts">
  import ModalTemplate from './ModalTemplate.svelte'
  import ApiWebradioService from '$services/api/api-webradio.service'
  import ApiVideosService from '$services/api/api-videos.service'
  import ApiArticlesService from '$services/api/api-articles.service'
  import MarkdownEditor from '$components/others/MarkdownEditor.svelte'
  import Post from '$components/others/Post.svelte'
  import AskGenerateAuthorizationModal from './AskGenerateAuthorizationModal.svelte'
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import type { Video } from '$models/features/video.model'
  import type { Article } from '$models/features/article.model'
  import type { PageData } from '../../routes/(main)/admin/[type=type]/$types'
  import io from '$services/api/socket.service'
  import utils from '$services/utils'
  import type { Authorization, Guest } from '$models/data/authorization.model'
  import EditPrompterModalContent from '$components/others/EditPrompterModalContent.svelte'

  export let data: PageData
  export let show: boolean
  export let type: 'emissions' | 'videos' | 'articles'
  export let action: { action: 'add' } | { action: 'edit'; element: WebradioShow | Video | Article }

  export let showAddEditAuthorizationModal: boolean
  export let authorizationModalElement: WebradioShow | Video | Article
  export let authorizationModalType: 'emissions' | 'videos' | 'articles'
  export let authorizationModalAction: { action: 'add' } | { action: 'edit'; authorization: Authorization }

  const apiWebradio = new ApiWebradioService()
  const apiVideos = new ApiVideosService()
  const apiArticles = new ApiArticlesService()

  let showGenerationModal = false

  $: showPrompterModal = false

  $: required = false as boolean
  $: title = '' as string
  $: content = '' as string
  $: thumbnail = undefined as File | string | undefined
  $: thumbnailSrc = '' as string
  $: streamId = '' as string
  $: podcastId = '' as string
  $: status = null as -2 | -2.5 | -1 | -1.5 | 0 | 0.5 | 1 | 2 | null
  $: videoId = '' as string
  $: category = null as 'news' | 'culture' | 'sport' | 'science' | 'tech' | 'laroche' | null
  $: videoType = null as 'youtube' | 'instagram' | null
  $: author = '' as string
  $: date = type !== 'emissions' ? Math.round(Date.now() / 1000) : Math.round(new Date().getTime() / 1000) + ''
  $: prompter = [
    { title: 'Introduction', content: '' },
    { title: '', content: '' },
    { title: 'Conclusion', content: '' }
  ] as { title: string; content: string }[]
  $: error = '' as string
  // $: showDate = { date: '', time: '' } as { date: string; time: string }

  $: if (show) {
    update()
  }

  function update() {
    error = ''
    showPrompterModal = false
    if (action.action === 'add') {
      required = true
      title = ''
      content = ''
      thumbnail = undefined
      thumbnailSrc = ''
      streamId = ''
      podcastId = ''
      status = -2
      videoId = ''
      category = null
      videoType = null
      author = ''
      // date = type !== 'emissions' ? Date.now() / 1000 : new Date().getTime() / 1000 + ''
      date = Date.now() / 1000
      prompter = [
        { title: 'Introduction', content: '' },
        { title: '', content: '' },
        { title: 'Conclusion', content: '' }
      ]
      // showDate = { date: '', time: '' }
    } else if (action.action === 'edit') {
      required = false
      title = action.element.title
      date = action.element.date
      thumbnail = action.element.thumbnail
      status = action.element.status
      if ('streamId' in action.element) {
        content = action.element.description
        streamId = action.element.streamId
        podcastId = action.element.podcastId || ''
        prompter = JSON.parse(action.element.prompter as string) || [
          { title: 'Introduction', content: '' },
          { title: '', content: '' },
          { title: 'Conclusion', content: '' }
        ]
        // let d = new Date(+date * 1000).toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' }).split('/')
        // showDate = {
        //   date: `${d[2]}-${d[1]}-${d[0]}`,
        //   time: new Date(+date * 1000).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris' })
        // }
      } else if ('videoId' in action.element) {
        content = action.element.description
        videoId = action.element.videoId
        category = action.element.category as 'news' | 'culture' | 'sport' | 'science' | 'tech' | 'laroche'
        videoType = action.element.type as 'youtube' | 'instagram'
        author = action.element.author
      } else {
        content = action.element.article
        thumbnailSrc = action.element.thumbnailSrc
        category = action.element.category as 'news' | 'culture' | 'sport' | 'science' | 'tech' | 'laroche'
        author = action.element.author
      }
    }
  }

  $: element = {
    data:
      type === 'emissions'
        ? ({ title, description: content, thumbnail, streamId, podcastId, date, status, prompter } as WebradioShow)
        : type === 'videos'
        ? ({ title, description: content, thumbnail, videoId, category, type: videoType, author, date, status } as Video)
        : ({ title, article: content, thumbnail, thumbnailSrc, category, author, date, status } as Article),
    type
  }

  async function submit() {
    let exec
    if (type === 'emissions' && 'streamId' in element.data) {
      element.data = element.data as WebradioShow
      element.data.prompter = JSON.stringify(element.data.prompter)
      exec = action.action === 'add' ? apiWebradio.postShow : apiWebradio.putShow
      ;(await exec(element.data, action.action === 'edit' ? action.element.id || 0 : 0)).subscribe({
        next: async (res) => {
          data.data = res.body.data?.shows || []
          element.data.id = res.body.data?.id
          // if (element.data.status === -1) io.emit('launchWaitStream', element.data)
          // else if (element.data.status === -1.5) io.emit('launchWaitRestream', element.data)
          // else if (element.data.status === 0) io.emit('launchLiveStream', element.data)
          // else if (element.data.status === 0.5) io.emit('launchRestream', element.data)
          // else if (element.data.status === -2.5) io.emit('stopLiveStream')
          // else io.emit('stopLiveRestream')

          // io.emit('updateShow', element.data)

          show = false
          await utils.sleep(300)
          if (
            action.action === 'add' ||
            !data.authorizations?.find((a) => a.elementId === action.element.id && a.elementType === 'show')
          ) {
            showGenerationModal = true
            authorizationModalElement = element.data
            authorizationModalType = 'emissions'
            authorizationModalAction = { action: 'add' }
          }
        },
        error: (err) => {
          error = err.body.message
        }
      })
    } else if (type === 'videos') {
      element.data = element.data as Video
      exec = action.action === 'add' ? apiVideos.postVideo : apiVideos.putVideo
      ;(await exec(element.data, action.action === 'edit' ? action.element.id || 0 : 0)).subscribe({
        next: async (res) => {
          data.data = res.body.data?.videos || []

          show = false
          await utils.sleep(300)
          if (
            action.action === 'add' ||
            !data.authorizations?.find((a) => a.elementId === action.element.id && a.elementType === 'video')
          ) {
            showGenerationModal = true
            authorizationModalElement = element.data
            authorizationModalType = 'videos'
            authorizationModalAction = { action: 'add' }
          }
        },
        error: (err) => {
          error = err.body.message
        }
      })
    } else {
      element.data = element.data as Article
      exec = action.action === 'add' ? apiArticles.postArticle : apiArticles.putArticle
      ;(await exec(element.data, action.action === 'edit' ? action.element.id || 0 : 0)).subscribe({
        next: async (res) => {
          data.data = res.body.data?.articles || []

          show = false
          await utils.sleep(300)
          if (
            action.action === 'add' ||
            !data.authorizations?.find((a) => a.elementId === action.element.id && a.elementType === 'article')
          ) {
            showGenerationModal = true
            authorizationModalElement = element.data
            authorizationModalType = 'articles'
            authorizationModalAction = { action: 'add' }
          }
        },
        error: (err) => {
          error = err.body.message
        }
      })
    }
  }

  function handleThumbnailChange(event: Event) {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
      thumbnail = target.files[0]
    } else {
      thumbnail = undefined
    }
  }
</script>

<ModalTemplate size={'l'} bind:show>
  <form on:submit|preventDefault={submit}>
    {#if action.action === 'add'}
      <h3>{type === 'emissions' ? 'Ajouter une émission' : type === 'videos' ? 'Ajouter une vidéo' : 'Ajouter un article'}</h3>
    {:else}
      <h3>
        {type === 'emissions' ? "Modifier l'émission" : type === 'videos' ? 'Modifier la vidéo' : "Modifier l'article"}
        <em>{action.element.title}</em>
      </h3>
    {/if}

    {#if !showPrompterModal}
      <div class="add-modal">
        <div class="add">
          <p class="section-title"><strong>{action.action === 'add' ? 'Ajouter du' : 'Modifier le'} contenu</strong></p>

          <label for="title">Titre</label>
          <!-- svelte-ignore a11y-autofocus -->
          <input type="text" bind:value={title} {required} autofocus id="title" />

          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label>{type === 'articles' ? 'Contenu' : 'Description'}</label>
          <MarkdownEditor bind:value={content} />
          <label for="thumbnail">Image de miniature (vignette), au format 16:9</label>
          <input type="file" accept=".png, .jpg, .jpeg" id="thumbnail" on:change={handleThumbnailChange} {required} />
          {#if type === 'emissions'}
            <!-- <label for="date">Date de diffusion :</label>
            <div class="flex-date">
              <input type="date" id="date" bind:value={showDate.date} />
              <input type="time" bind:value={showDate.time} />
            </div> -->
            <label for="stream-id">ID du direct YouTube et OBS</label>
            <input type="text" placeholder="ID après /watch?v= sur YouTube" bind:value={streamId} {required} id="stream-id" />
            <!-- <input
              type="text"
              placeholder="ID du podcast sur Ausha (facultatif pour le direct, obligatoire pour publier le podcast)"
              bind:value={podcastId}
              required={required && status === 2}
            /> -->
            <!-- <select bind:value={status} {required}>
              <option value={null} disabled selected>-- Status de l'émission --</option>
              <option value={-2}>Brouillon, en attente de l'autorisation de diffusion par l'administration</option>
              <option value={-1}>Salle d'attente du direct</option>
              <option value={0}>En direct</option>
              <option value={-2.5}>En attente de rediffusion</option>
              <option value={-1.5}>Salle d'attente de rediffusion</option>
              <option value={0.5}>En rediffusion</option>
              <option value={1}>En attente de validation de publication par l'administration</option>
              <option value={2}>Publié au format podcast</option>
            </select> -->

            <p class="section-title" style="margin-top: 30px"><strong>Modifier le prompteur</strong></p>
            <button class="secondary" style="margin-top: 0" type="button" on:click={() => (showPrompterModal = true)}>
              <i class="fa-solid fa-align-left" />&nbsp;&nbsp;Modifier le prompteur
            </button>
          {:else}
            <!-- <select bind:value={status} {required}>
              <option value={null} disabled selected>-- Status de {type === 'videos' ? 'la video' : "l'article"} --</option>
              <option value={-2}>Brouillon, en attente de l'autorisation de publication par l'administration</option>
              <option value={2}>Publié</option>
            </select> -->
            {#if type === 'videos'}
              <label for="category">Rubrique</label>
              <select bind:value={category} {required} id="category">
                <option value={null} disabled selected>-- Sélectionner --</option>
                <option value={'news'}>Actualités</option>
                <option value={'culture'}>Culture</option>
                <option value={'sport'}>Sport</option>
                <option value={'science'}>Sciences</option>
                <option value={'tech'}>Tech</option>
                <option value={'laroche'}>La Roche</option>
              </select>

              <label for="video-type">Type de vidéo</label>
              <select bind:value={videoType} {required} id="video-type">
                <option value={null} disabled selected>-- Sélectionner --</option>
                <option value={'instagram'}>Instagram</option>
                <option value={'youtube'}>YouTube</option>
              </select>

              <label for="video-id2">ID de la vidéo</label>
              <input
                type="text"
                placeholder="ID près /watch?v= sur YouTube, après /p/ sur Instagram"
                bind:value={videoId}
                {required}
                id="video-id2"
              />

              <label for="author">Auteur</label>
              <input type="text" bind:value={author} {required} id="author" />
            {:else}
              <label for="thumbnail-src">Source de la miniature</label>
              <input type="text" bind:value={thumbnailSrc} placeholder="Ex : AFP" {required} id="thumbnail-src" />

              <label for="category2">Rubrique</label>
              <select bind:value={category} {required} id="category2">
                <option value={null} disabled selected>-- Sélectionner --</option>
                <option value={'news'}>Actualités</option>
                <option value={'culture'}>Culture</option>
                <option value={'sport'}>Sport</option>
                <option value={'science'}>Sciences</option>
                <option value={'tech'}>Tech</option>
                <option value={'laroche'}>La Roche</option>
              </select>

              <label for="author2">Auteur</label>
              <input type="text" bind:value={author} {required} id="author2" />
            {/if}
          {/if}
        </div>

        <div class="preview">
          <p class="section-title"><strong>Prévisualisation</strong></p>
          <Post data={element} preview />
        </div>
      </div>
    {/if}

    {#if showPrompterModal}
      <EditPrompterModalContent bind:showPrompterModal bind:prompter />
    {/if}

    {#if !showPrompterModal}
      <div class="actions">
        <p class="error">{error}</p>
        <button class="primary">{action.action === 'add' ? 'Ajouter' : 'Modifier'}</button>
      </div>
    {/if}
  </form>
</ModalTemplate>

<AskGenerateAuthorizationModal
  bind:show={showGenerationModal}
  bind:showAddEditAuthorizationModal
  bind:type={authorizationModalType}
  bind:element={authorizationModalElement}
  bind:action={authorizationModalAction}
/>

<style lang="scss">
  @use '../../../static/assets/sass/modal.scss';

  p.section-title {
    margin-top: 0;
  }

  div.add-modal {
    display: flex;
    flex-direction: column;
    gap: 30px;

    &:before {
      content: '';
      border-left: 1px solid var(--light-gray-color);
      align-self: stretch;
    }
  }

  div.add {
    order: -1;
  }

  div.flex-date {
    display: flex;
    flex: 1;
    flex-direction: row;
    gap: 15px;
    width: calc(50% - 7.5px);
  }

  @media screen and (min-width: 850px) {
    div.add-modal {
      flex-direction: row;

      div.add {
        flex: 1 1 50%;
      }

      div.preview {
        flex: 1 1 50%;
      }
    }
  }
</style>
