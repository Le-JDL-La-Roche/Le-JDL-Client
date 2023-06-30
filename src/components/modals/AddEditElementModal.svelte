<script lang="ts">
  import ModalTemplate from './ModalTemplate.svelte'
  import CookiesService from '$services/cookies.service'
  import { invalidateAll } from '$app/navigation'
  import ApiWebradioService from '$services/api/api-webradio.service'
  import ApiVideosService from '$services/api/api-videos.service'
  import ApiArticlesService from '$services/api/api-articles.service'
  import MarkdownEditor from '$components/others/MarkdownEditor.svelte'
  import Post from '$components/lists/Post.svelte'
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import type { Video } from '$models/features/video.model'
  import type { Article } from '$models/features/article.model'

  export let show: boolean
  export let type: 'emissions' | 'videos' | 'articles' | undefined
  export let action: { action: 'add' } | { action: 'edit'; element: WebradioShow | Video | Article }

  const cookies = new CookiesService()
  const apiWebradio = new ApiWebradioService()
  const apiVideos = new ApiVideosService()
  const apiArticles = new ApiArticlesService()

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
  $: date = type !== 'emissions' ? Date.now() / 1000 : new Date().getTime() / 1000 + ''

  $: if (show) {
    update()
  }

  function update() {
    console.log(action)

    if (action.action === 'add') {
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
      title = action.element.title
      date = action.element.date
      thumbnail = action.element.thumbnail
      if ('streamId' in action.element) {
        content = action.element.description
        streamId = action.element.streamId
        podcastId = action.element.podcastId || ''
        status = action.element.status
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

  $: data = {
    data:
      type === 'emissions'
        ? ({ title, description: content, thumbnail, streamId, podcastId, date, status } as WebradioShow)
        : type === 'videos'
        ? ({ title, description: content, thumbnail, videoId, category, type: videoType, author, date } as Video)
        : ({ title, article: content, thumbnail, thumbnailSrc, category, author, date } as Article),
    type: type === 'emissions' ? 'emissions' : type === 'videos' ? 'videos' : 'articles'
  }

  function submit() {
    show = false
    invalidateAll()
  }
</script>

<ModalTemplate size={'l'} bind:show>
  <form on:submit|preventDefault={submit}>
    {#if action.action === 'add'}
      <h3>{type === 'emissions' ? 'Ajouter une émission' : type === 'videos' ? 'Ajouter une vidéo' : 'Ajouter un article'}</h3>
    {:else}
      <h3>
        {type === 'emissions' ? "Modifier l'émission" : type === 'videos' ? 'Modifier la vidéo' : "Modifier l'article"}
        <i>{action.element.title}</i>
      </h3>
    {/if}

    <div class="add-modal">
      <div class="add">
        <p class="section-title"><b>{action.action === 'add' ? 'Ajouter du' : 'Modifier le'} contenu</b></p>

        <input type="text" placeholder="Titre" bind:value={title} required />
        <MarkdownEditor bind:value={content} />
        <label for="thumbnail">Image de miniature (vignette), au format 16:9 :</label>
        <input type="file" accept=".png, .jpg, .jpeg" id="thumbnail" bind:value={thumbnail} required />
        {#if type === 'emissions'}
          <input
            type="datetime-local"
            value={new Date().toISOString().slice(0, 16)}
            on:change={(event) => (date = new Date(event.currentTarget.value).getTime() / 1000)}
            required
          />
          <input type="text" placeholder="ID de stream sur OBS" bind:value={streamId} required />
          <input
            type="text"
            placeholder="ID de podcast sur Ausha (facultatif pour le direct, obligatoire pour publier le podcast)"
            bind:value={podcastId}
            required
          />
          <select bind:value={status}>
            <option value={null} disabled selected>-- Status de l'émission --</option>
            <option value={-1}>Brouillon, en attente de l'autorisation de diffusion par l'administration</option>
            <option value={0}>En direct</option>
            <option value={1}>En attente de validation de publication par l'administration</option>
            <option value={2}>Publié au format podcast</option>
          </select>
        {:else if type === 'videos'}
          <select bind:value={category}>
            <option value={null} disabled selected>-- Rubrique --</option>
            <option value={'news'}>Actualités</option>
            <option value={'culture'}>Culture</option>
            <option value={'sport'}>Sport</option>
            <option value={'science'}>Sciences</option>
            <option value={'tech'}>Tech</option>
            <option value={'laroche'}>La Roche</option>
          </select>
          <select bind:value={videoType}>
            <option value={null} disabled selected>-- Type de vidéo --</option>
            <option value={'instagram'}>Instagram</option>
            <option value={'youtube'}>YouTube</option>
          </select>
          <input
            type="text"
            placeholder="ID de la vidéo (après ?v= sur YouTube, après /p/ sur Instagram)"
            bind:value={videoId}
            required
          />
          <input type="text" placeholder="Auteur" bind:value={author} required />
        {/if}
      </div>

      <div class="preview">
        <p class="section-title"><b>Prévisualisation</b></p>
        <Post {data} preview />
      </div>
    </div>

    <div class="actions">
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
