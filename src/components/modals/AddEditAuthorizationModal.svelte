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
  import PageAuthorization from '$components/others/PageAuthorization.svelte'
  import PageGuestAuthorization from '$components/others/PageGuestAuthorization.svelte'

  export let data: PageData
  export let show: boolean
  export let element: WebradioShow | Video | Article
  export let type: 'emissions' | 'videos' | 'articles'
  export let action: { action: 'add' } | { action: 'edit'; authorization: Authorization }

  const apiAuthorizations = new ApiAuthorizationsService()

  $: elementId = null as number | null
  $: content = '' as any
  $: error = '' as string
  $: guestId = false as number | false

  $: if (show) {
    update()
  }

  function update() {
    error = ''
    guestId = false
    if (action.action === 'add') {
      elementId = element.id || 0
      if (type === 'emissions') {
        element = element as WebradioShow
        content = {
          title: element.title,
          subject: '',
          date: element.date,
          estimatedDuration: '40 mn',
          inGuests: [
            { name: '', status: '', authorization: false },
            { name: '', status: '', authorization: false }
          ],
          outGuests: [{ name: '', status: '', authorization: false }],
          synopsis: element.description
        } as WebradioAuthorization
      } else if (type === 'videos') {
        element = element as Video
        content = {
          title: element.title,
          subject: '',
          medium: '',
          author: element.author,
          duration: 0,
          inGuests: [],
          outGuests: [],
          synopsis: element.description
        } as VideoAuthorization
      } else if (type === 'articles') {
        element = element as Article
        content = {
          title: element.title,
          subject: '',
          author: element.author,
          synopsis: ''
        } as ArticleAuthorization
      }
    } else if (action.action === 'edit') {
      elementId = action.authorization.elementId
      if (type === 'emissions') content = JSON.parse(action.authorization.content as string) as WebradioAuthorization
      else if (type === 'videos') content = JSON.parse(action.authorization.content as string) as VideoAuthorization
      else if (type === 'articles') content = JSON.parse(action.authorization.content as string) as ArticleAuthorization
    }
  }

  $: authorization = {
    elementId: elementId || 0,
    elementType: type === 'emissions' ? 'show' : type === 'videos' ? 'video' : type === 'articles' ? 'article' : 'guest',
    content: content
  } as Authorization

  function print() {
    document.execCommand('print', false)
  }

  async function submit() {
    let exec
    authorization.content = JSON.stringify(authorization.content)
    exec = action.action === 'add' ? apiAuthorizations.postAuthorization : apiAuthorizations.putAuthorization
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
</script>

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
        <PageAuthorization bind:type bind:authorization bind:guestId />
      {:else}
        <PageGuestAuthorization bind:guestId bind:authorization />
      {/if}

      <div class="actions">
        <p class="error">{error}</p>
        <div class="flex">
          {#if guestId === false}
            <button class="secondary" on:click={print} type="button">Imprimer</button>
            <button class="primary">{action.action === 'add' ? 'Ajouter' : 'Modifier'}</button>
          {:else}
            <button
              class="secondary"
              on:click={() => {
                document.querySelector('div#modal__')?.scrollTo(0, 0)
                guestId = false
              }}
              type="button"
              style="width: 100px"
            >
              <i class="fa-solid fa-caret-left" />&nbsp;&nbsp;Retour
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

    div.actions {
      display: block;
    }
  }

  @media print {
    div.actions,
    h3 {
      display: none;
    }
  }
</style>