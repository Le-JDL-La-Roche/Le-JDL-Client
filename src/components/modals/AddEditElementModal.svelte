<script lang="ts">
  import ModalTemplate from './ModalTemplate.svelte'
  import ApiWebradioService from '$services/api/api-webradio.service'
  import ApiVideosService from '$services/api/api-videos.service'
  import ApiArticlesService from '$services/api/api-articles.service'
  import MarkdownEditor from '$components/others/MarkdownEditor.svelte'
  import Post from '$components/others/Post.svelte'
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import type { Video } from '$models/features/video.model'
  import type { Article } from '$models/features/article.model'
  import type { PageData } from '../../routes/(main)/admin/[type=type]/$types'
  import io from '$services/api/socket.service'

  export let data: PageData
  export let show: boolean
  export let type: 'emissions' | 'videos' | 'articles'
  export let action: { action: 'add' } | { action: 'edit'; element: WebradioShow | Video | Article }

  const apiWebradio = new ApiWebradioService()
  const apiVideos = new ApiVideosService()
  const apiArticles = new ApiArticlesService()

  $: required = false as boolean
  $: title = '' as string
  $: content = '' as string
  $: thumbnail = undefined as File | string | undefined
  $: thumbnailSrc = '' as string
  $: streamId = '' as string
  $: podcastId = '' as string
  $: status = null as -1 | 0 | 1 | 2 | null
  $: videoId = '' as string
  $: category = null as 'news' | 'culture' | 'sport' | 'science' | 'tech' | 'laroche' | null
  $: videoType = null as 'youtube' | 'instagram' | null
  $: author = '' as string
  $: date = type !== 'emissions' ? Math.round(Date.now() / 1000) : Math.round(new Date().getTime() / 1000) + ''
  $: error = '' as string
  $: showDate = { date: '', time: '' } as { date: string; time: string }

  $: if (show) {
    update()
  }

  function update() {
    error = ''
    if (action.action === 'add') {
      required = true
      title = ''
      content = ''
      thumbnail = undefined
      thumbnailSrc = ''
      streamId = ''
      podcastId = ''
      status = null
      videoId = ''
      category = null
      videoType = null
      author = ''
      date = type !== 'emissions' ? Date.now() / 1000 : new Date().getTime() / 1000 + ''
    } else if (action.action === 'edit') {
      required = false
      title = action.element.title
      date = action.element.date
      thumbnail = action.element.thumbnail
      if ('streamId' in action.element) {
        content = action.element.description
        streamId = action.element.streamId
        podcastId = action.element.podcastId || ''
        status = action.element.status
        let d = new Date(+date * 1000).toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' }).split('/')
        showDate = {
          date: `${d[2]}-${d[1]}-${d[0]}`,
          time: new Date(+date * 1000).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris' })
        }
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
        ? ({
            title,
            description: content,
            thumbnail,
            streamId,
            podcastId,
            date: Date.parse(showDate.date + ' ' + showDate.time) / 1000 + '',
            status
          } as WebradioShow)
        : type === 'videos'
        ? ({ title, description: content, thumbnail, videoId, category, type: videoType, author, date } as Video)
        : ({ title, article: content, thumbnail, thumbnailSrc, category, author, date } as Article),
    type
  }

  async function submit() {
    let exec
    if (type === 'emissions') {
      exec = action.action === 'add' ? apiWebradio.postShow : apiWebradio.putShow
      ;(await exec(element.data as WebradioShow, action.action === 'edit' ? action.element.id || 0 : 0)).subscribe({
        next: (res) => {
          data.data = res.body.data?.shows || []
          if ((element.data as WebradioShow).status === 0) {
            io.emit('launchLiveStream', element.data as WebradioShow)
          } else {
            io.emit('stopLiveStream')
          }
          show = false
        },
        error: (err) => {
          error = err.body.message
        }
      })
    } else if (type === 'videos') {
      exec = action.action === 'add' ? apiVideos.postVideo : apiVideos.putVideo
      ;(await exec(element.data as Video, action.action === 'edit' ? action.element.id || 0 : 0)).subscribe({
        next: (res) => {
          data.data = res.body.data?.videos || []
          show = false
        },
        error: (err) => {
          error = err.body.message
        }
      })
    } else {
      exec = action.action === 'add' ? apiArticles.postArticle : apiArticles.putArticle
      ;(await exec(element.data as Article, action.action === 'edit' ? action.element.id || 0 : 0)).subscribe({
        next: (res) => {
          data.data = res.body.data?.articles || []
          show = false
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

    <div class="add-modal">
      <div class="add">
        <p class="section-title"><strong>{action.action === 'add' ? 'Ajouter du' : 'Modifier le'} contenu</strong></p>

        <!-- svelte-ignore a11y-autofocus -->
        <input type="text" placeholder="Titre" bind:value={title} {required} autofocus />
        <MarkdownEditor bind:value={content} />
        <label for="thumbnail">Image de miniature (vignette), au format 16:9 :</label>
        <input type="file" accept=".png, .jpg, .jpeg" id="thumbnail" on:change={handleThumbnailChange} {required} />
        {#if type === 'emissions'}
          <label for="date">Date de diffusion :</label>
          <div class="flex-date">
            <input type="date" id="date" bind:value={showDate.date} />
            <input type="time" bind:value={showDate.time} />
          </div>
          <input type="text" placeholder="ID de stream sur OBS (streamkey)" bind:value={streamId} {required} />
          <input
            type="text"
            placeholder="ID de podcast sur Ausha (facultatif pour le direct, obligatoire pour publier le podcast)"
            bind:value={podcastId}
            {required}
          />
          <select bind:value={status} {required}>
            <option value={null} disabled selected>-- Status de l'émission --</option>
            <option value={-1}>Brouillon, en attente de l'autorisation de diffusion par l'administration</option>
            <option value={0}>En direct</option>
            <option value={1}>En attente de validation de publication par l'administration</option>
            <option value={2}>Publié au format podcast</option>
          </select>
        {:else if type === 'videos'}
          <select bind:value={category} {required}>
            <option value={null} disabled selected>-- Rubrique --</option>
            <option value={'news'}>Actualités</option>
            <option value={'culture'}>Culture</option>
            <option value={'sport'}>Sport</option>
            <option value={'science'}>Sciences</option>
            <option value={'tech'}>Tech</option>
            <option value={'laroche'}>La Roche</option>
          </select>
          <select bind:value={videoType} {required}>
            <option value={null} disabled selected>-- Type de vidéo --</option>
            <option value={'instagram'}>Instagram</option>
            <option value={'youtube'}>YouTube</option>
          </select>
          <input
            type="text"
            placeholder="ID de la vidéo (après ?v= sur YouTube, après /p/ sur Instagram)"
            bind:value={videoId}
            {required}
          />
          <input type="text" placeholder="Auteur" bind:value={author} {required} />
        {:else}
          <input type="text" bind:value={thumbnailSrc} placeholder="Source de la miniature (site)" {required} />
          <select bind:value={category} {required}>
            <option value={null} disabled selected>-- Rubrique --</option>
            <option value={'news'}>Actualités</option>
            <option value={'culture'}>Culture</option>
            <option value={'sport'}>Sport</option>
            <option value={'science'}>Sciences</option>
            <option value={'tech'}>Tech</option>
            <option value={'laroche'}>La Roche</option>
          </select>
          <input type="text" placeholder="Auteur" bind:value={author} {required} />
        {/if}
      </div>

      <div class="preview">
        <p class="section-title"><strong>Prévisualisation</strong></p>
        <Post data={element} preview />
      </div>
    </div>

    <div class="actions">
      <p class="error">{error}</p>
      <button class="primary">{action.action === 'add' ? 'Ajouter' : 'Modifier'}</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @use '../../../static/assets/sass/modal.scss';

  p.section-title {
    margin-top: 0;
  }

  div.add-modal {
    display: flex;
    flex-direction: column;
    gap: 30px;
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
