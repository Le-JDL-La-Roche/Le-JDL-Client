<script lang="ts">
  import ModalTemplate from './ModalTemplate.svelte'
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import type { Video } from '$models/features/video.model'
  import type { Article } from '$models/features/article.model'
  import type {
    Authorization,
    WebradioAuthorization,
    VideoAuthorization,
    ArticleAuthorization
  } from '$models/data/authorization.model'
  import ApiAuthorizationsService from '$services/api/api-authorizations.service'
  import type { PageData } from '../../routes/(main)/admin/[type=type]/$types'
  import PageMajorGuestAuthorization from '$components/others/PageMajorGuestAuthorization.svelte'
  import PageMinorGuestAuthorization from '$components/others/PageMinorGuestAuthorization.svelte'
  import { printAuthorization$ } from '$services/store'
  import utils from '$services/utils'
  import AuthorizationForm from '$components/others/AuthorizationForm.svelte'

  export let data: PageData
  export let show: boolean
  export let element: WebradioShow | Video | Article
  export let type: 'emissions' | 'videos' | 'articles'
  export let action: { action: 'add' } | { action: 'edit'; authorization: Authorization }

  const apiAuthorizations = new ApiAuthorizationsService()

  $: elementId = null as number | null
  $: elementType = null as 'show' | 'video' | 'article' | 'guest' | null
  $: content = '' as any
  $: submitDate = null as Date | string | null
  $: status = -2 as number
  $: manager = '' as string
  $: comments = '' as string
  $: responseDate = null as Date | string | null
  $: signature = '' as string

  $: error = '' as string
  $: guestId = false as number | false
  $: guestType = false as 'in' | 'out' | false

  $: if (show) {
    update()
  }

  function update() {
    error = ''
    guestId = false
    guestType = false

    elementType = type === 'emissions' ? 'show' : type === 'videos' ? 'video' : type === 'articles' ? 'article' : 'guest'
    submitDate = Date.now() / 1000 + ''
    status = -2
    manager = ''
    comments = ''
    responseDate = null
    signature = ''
    if (action.action === 'add') {
      elementId = element.id || 0
      if (type === 'emissions') {
        element = element as WebradioShow
        content = {
          subject: '',
          date: element.date,
          estimatedDuration: '40 mn',
          inGuests: [
            {
              name: '',
              status: '',
              authorization: false,
              authorizationType: false,
              eventType: "[l'émission de radio/l'enregistrement vidéo]",
              date: '[date]',
              place: '[au Lycée La Rochefoucauld (75007 PARIS)]',
              use: '[diffusés en direct et publiés après montage]',
              media: '[le site Web, le compte Instagram, la chaîne YouTube, le compte LinkedIn et les plateformes de streaming]'
            },
            {
              name: '',
              status: '',
              authorization: false,
              authorizationType: false,
              eventType: "[l'émission de radio/l'enregistrement vidéo]",
              date: '[date]',
              place: '[au Lycée La Rochefoucauld (75007 PARIS)]',
              use: '[diffusés en direct et publiés après montage]',
              media: '[le site Web, le compte Instagram, la chaîne YouTube, le compte LinkedIn et les plateformes de streaming]'
            }
          ],
          outGuests: [
            {
              name: '',
              status: '',
              authorization: false,
              authorizationType: false,
              eventType: "[l'émission de radio/l'enregistrement vidéo]",
              date: '[date]',
              place: '[au Lycée La Rochefoucauld (75007 PARIS)]',
              use: '[diffusés en direct et publiés après montage]',
              media: '[le site Web, le compte Instagram, la chaîne YouTube, le compte LinkedIn et les plateformes de streaming]'
            }
          ],
          synopsis: '',
          link: `https://youtube.com/watch?v=${element.streamId}`
        } as WebradioAuthorization
      } else if (type === 'videos') {
        element = element as Video
        content = {
          subject: '',
          duration: '1 mn',
          inGuests: [],
          outGuests: [],
          synopsis: '',
          link: element.type === 'youtube' ? `https://youtube.com/watch?v=${element.videoId}` : ''
        } as VideoAuthorization
      } else if (type === 'articles') {
        element = element as Article
        content = {
          subject: '',
          author: element.author,
          synopsis: ''
        } as ArticleAuthorization
      }
    } else if (action.action === 'edit') {
      elementId = action.authorization.elementId
      content =
        type === 'emissions'
          ? (JSON.parse(action.authorization.content as string) as WebradioAuthorization)
          : type === 'videos'
          ? (JSON.parse(action.authorization.content as string) as VideoAuthorization)
          : (JSON.parse(action.authorization.content as string) as ArticleAuthorization)
      submitDate = Date.now() / 1000 + ''
      status = action.authorization.status
      manager = action.authorization.manager || ''
      comments = action.authorization.comments || ''
      responseDate = action.authorization.responseDate || null
      signature = action.authorization.signature || ''
    }
  }

  $: authorization = {
    elementId,
    elementType,
    content,
    submitDate,
    status,
    manager,
    comments,
    responseDate,
    signature
  } as Authorization

  async function print() {
    printAuthorization$.set({ guestId: guestId, guestType: guestType, authorization: authorization, type: type })
    await utils.sleep(300)
    window.print()
    printAuthorization$.set(false)
  }

  async function save() {
    const exec = action.action === 'add' ? apiAuthorizations.postAuthorization : apiAuthorizations.putAuthorization
    authorization.content = JSON.stringify(authorization.content)
    ;(await exec(authorization, action.action === 'edit' ? action.authorization.id || 0 : 0)).subscribe({
      next: (res) => {
        data.authorizations = res.body.data?.authorizations || []
        show = false
      },
      error: (err) => {
        error = err.body.message
      }
    })
  }

  async function submit() {
    if (status != -2 && status != 1) return
    if (!confirm('Êtes-vous sûr de vouloir envoyer cette autorisation ? Vous ne pourrez plus la modifier.')) return
    authorization.status = -1
    await save()
  }
</script>

<svelte:head>
  <meta name="author" content="Le JDL - La Rochefoucauld" />
</svelte:head>

<ModalTemplate size={'l'} bind:show>
  <form on:submit|preventDefault={() => submit()}>
    <h3>
      {action.action === 'add' ? 'Créer une' : 'Modifier la'} demande d'autorisation pour {type === 'emissions'
        ? "l'émission"
        : type === 'videos'
        ? 'la vidéo'
        : type === 'articles'
        ? "l'article"
        : "pour l'invité.e"}
      {@html 'name' in element ? element.name : '<em>' + element.title + '</em>'}
    </h3>

    <div class="pages">
      {#if guestId === false}
        <AuthorizationForm bind:type bind:authorization bind:element bind:guestId bind:guestType />
      {:else if (guestType === 'in' && typeof authorization.content !== 'string' && 'inGuests' in authorization.content && authorization.content.inGuests[guestId].authorizationType === 'M') || (guestType === 'out' && typeof authorization.content !== 'string' && 'outGuests' in authorization.content && authorization.content.outGuests[guestId].authorizationType === 'M')}
        <PageMajorGuestAuthorization bind:guestId bind:guestType bind:authorization />
      {:else if (guestType === 'in' && typeof authorization.content !== 'string' && 'inGuests' in authorization.content && authorization.content.inGuests[guestId].authorizationType === 'm') || (guestType === 'out' && typeof authorization.content !== 'string' && 'outGuests' in authorization.content && authorization.content.outGuests[guestId].authorizationType === 'm')}
        <PageMinorGuestAuthorization bind:guestId bind:guestType bind:authorization />
      {/if}

      <div class="actions">
        <p class="error">{error}</p>
        <div class="flex">
          {#if guestId === false}
          {#if authorization.status === -2 || authorization.status === 1}
            <button class="secondary" on:click={save} type="button">Enregistrer en tant que brouillon</button>
            <button class="primary">Enregistrer et envoyer</button>
          {:else}
            <button class="secondary" on:click={() => show = false} type="button">Fermer</button>
          {/if}
          {:else}
            <button
              class="secondary"
              on:click={() => {
                document.querySelector('div#modal__')?.scrollTo(0, 0)
                guestId = false
                guestType = false
              }}
              type="button"
              style="width: 200px"
            >
              <i class="fa-solid fa-caret-left" />&nbsp;&nbsp;Enregistrer & Retour
            </button>
            <button class="secondary" on:click={print} type="button">Imprimer</button>
          {/if}
        </div>
      </div>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @use '../../../static/assets/sass/modal.scss';

  div.actions {
    display: none;
  }

  div.actions div.flex {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 15px;
    margin-top: 30px;

    button {
      margin-top: 0;
      &.secondary {
        height: 37px;
      }
    }
  }

  @media screen and (min-width: 850px) {
    div.actions {
      display: block;
    }
  }
</style>
