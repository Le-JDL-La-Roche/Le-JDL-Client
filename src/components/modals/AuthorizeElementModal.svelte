<script lang="ts">
  import ModalTemplate from './ModalTemplate.svelte'
  import Post from '$components/others/Post.svelte'
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import type { Video } from '$models/features/video.model'
  import type { Article } from '$models/features/article.model'
  import type { PageData } from '../../routes/(main)/verif/$types'
  import type { Authorization, Guest } from '$models/data/authorization.model'
  import ContentService from '$services/content.service'
  import ApiAuthorizationsService from '$services/api/api-authorizations.service'

  export let show: boolean
  export let data: PageData
  export let authorization: Authorization
  export let element: WebradioShow | Video | Article
  export let type: 'emissions' | 'videos' | 'articles'
  export let authorizationId: number | null

  const content = new ContentService()
  const apiAuthorization = new ApiAuthorizationsService()

  $: comments = '' as string

  $: if (show) {
    update()
  }

  function update() {
    comments = authorization.comments || ''
  }

  // remove all empty guests
  $: if (typeof authorization.content !== 'string' && 'inGuests' in authorization.content) {
    authorization.content.inGuests = authorization.content.inGuests.filter((guest) => guest.name?.trim() !== '')
    authorization.content.outGuests = authorization.content.outGuests.filter((guest) => guest.name?.trim() !== '')
  }

  async function submit(status: 1 | 2) {
    if (authorization.status !== -1) return
    if (!confirm('Êtes-vous sûr de vouloir envoyer cette réponse ? Vous ne pourrez pas la modifier.')) return
    ;(await apiAuthorization.putAuthorization({ status, comments }, authorization.id || 0)).subscribe({
      next: (res) => {
        data.data.authorizations = res.body.data?.authorizations || []
        show = false
        if (authorizationId) {
          window.close()
        }
      }
    })
  }
</script>

<ModalTemplate size={'l'} bind:show>
  <form>
    <h3>
      Autorisation pour {type === 'emissions' ? "l'émission" : type === 'videos' ? 'la vidéo' : "l'article"}
      <em>{element.title}</em>
    </h3>

    <div class="add-modal">
      <div class="add">
        <div class="info date">
          <p>
            <i class="fa-solid fa-calendar-days" />&nbsp;&nbsp;&nbsp;Autorisation soumise le
            <strong>{new Date(+(authorization.submitDate || 0) * 1000).toLocaleDateString('fr-fr')}</strong>.
            {#if authorization.status !== -1}
              Réponse envoyée le <strong>{new Date(+(authorization.responseDate || 0) * 1000).toLocaleDateString('fr-fr')}</strong
              >.
            {/if}
          </p>
        </div>
        <div
          class="info"
          class:waiting={authorization.status == -1}
          class:refused={authorization.status == 1}
          class:approved={authorization.status == 2}
        >
          {#if authorization.status == -1}
            <p>
              <i class="fa-solid fa-hourglass-half" />&nbsp;&nbsp;&nbsp;<strong>En attente</strong> — Cette demande d'autorisation
              est en attente d'une réponse.
            </p>
          {:else if authorization.status == 1}
            <p>
              <button
                class="secondary"
                on:click|stopPropagation={() => {
                  navigator.clipboard.writeText(authorization.signature + '')
                  alert(`Signature copiée ! 
Vous pouvez vérifier la signature en utilisant un décrypteur RSA et la clé publique disponible sur la page "A propos de l'API". 
Le décryptage de la signature ne fonctionnera que si la signature est valide. Seul le serveur du JDL est en mesure de créer des signatures valides ; une signature ne peut donc pas être falsifiée.`)
                }}
              >
                <i class="fa-solid fa-copy" />
              </button>
              <i class="fa-solid fa-ban" />&nbsp;&nbsp;&nbsp;<strong>Refusée</strong> — Publication refusée par {authorization.manager}.
              Motif : <i>{authorization.comments}</i>. Vous ne pouvez pas apporter de modifications à la réponse.
            </p>
          {:else if authorization.status == 2}
            <p>
              <button
                class="secondary"
                on:click|stopPropagation={() => {
                  navigator.clipboard.writeText(authorization.signature + '')
                  alert(`Signature copiée ! 
Vous pouvez vérifier la signature en utilisant un décrypteur RSA et la clé publique disponible sur la page "A propos de l'API". 
Le décryptage de la signature ne fonctionnera que si la signature est valide. Seul le serveur du JDL est en mesure de créer des signatures valides ; une signature ne peut donc pas être falsifiée.`)
                }}
              >
                <i class="fa-solid fa-copy" />
              </button>
              <i class="fa-solid fa-check" />&nbsp;&nbsp;&nbsp;<strong>Acceptée</strong> — Publication autorisée par {authorization.manager}.
              Vous ne pouvez pas apporter de modifications à la réponse.
            </p>
          {/if}
        </div>

        {#if typeof authorization.content !== 'string'}
          <p>
            <strong>Présentation de {type === 'emissions' ? "l'émission" : type === 'videos' ? 'la vidéo' : "l'article"}</strong>
          </p>

          <label>Titre</label>
          <p class="field">{element.title}</p>

          <label>{type === 'articles' ? 'Sujet' : 'Thème(s)'}</label>
          <p class="field">{authorization.content.subject}</p>

          {#if type === 'emissions' && 'estimatedDuration' in authorization.content}
            <div class="flex-date">
              <div style="flex: 1">
                <label>Date de publication</label>
                <p class="field">{new Date(+authorization.content.date * 1000).toLocaleDateString('fr-fr')}</p>
              </div>
              <div style="flex: 1">
                <label>Durée estimée</label>
                <p class="field">{authorization.content.estimatedDuration}</p>
              </div>
            </div>

            <label>Lien de visionnage (la vidéo n'est pas encore disponible publiquement)</label>
            <a class="field" target="_blank" href={authorization.content.link}>{authorization.content.link}</a>
          {:else if type === 'videos' && 'type' in element && 'duration' in authorization.content}
            <label>Publication sur</label>
            <p class="field">{element.type === 'instagram' ? 'Instagram' : 'YouTube'}</p>

            <label>Lien de visionnage (la vidéo n'est pas encore disponible publiquement)</label>
            <a class="field">{authorization.content.link}</a>

            <div class="flex-date">
              <div style="flex: 1">
                <label>Durée</label>
                <p class="field">{authorization.content.duration}</p>
              </div>
              <div style="flex: 1">
                <label>Auteur</label>
                <p class="field">{element.author}</p>
              </div>
            </div>
          {:else if type === 'articles' && 'author' in element}
            <label>Auteur</label>
            <p class="field">{element.author}</p>
          {/if}

          {#if type !== 'articles' && 'inGuests' in authorization.content}
            <p style="margin-top: 10px"><strong>Intervenants de l'établissement</strong></p>

            <table class="filling">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Statut</th>
                  <th class="image-right">Droit à l'image</th>
                </tr>
              </thead>
              <tbody>
                {#each authorization.content.inGuests as guest, i}
                  <tr>
                    <td class="name">
                      <p class="field">{guest.name}</p>
                    </td>
                    <td class="status">
                      <p class="field">{guest.status}</p>
                    </td>
                    <td class="allow">
                      {guest.authorization ? '✅' : '❌'}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          {/if}

          {#if type !== 'articles' && 'outGuests' in authorization.content}
            <p style="margin-top: 30px"><strong>Intervenants extérieurs</strong></p>

            <table class="filling">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Statut</th>
                  <th class="image-right">Droit à l'image</th>
                </tr>
              </thead>
              <tbody>
                {#each authorization.content.outGuests as guest, i}
                  <tr>
                    <td class="name">
                      <p class="field">{guest.name}</p>
                    </td>
                    <td class="status">
                      <p class="field">{guest.status}</p>
                    </td>
                    <td class="allow">
                      {guest.authorization ? '✅' : '❌'}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          {/if}

          <p style="margin-top: 30px"><strong>Synopsis</strong></p>

          {@html content.markdownToHtml(authorization.content.synopsis)}

          {#if authorization.status == -1}
            <div class="actions">
              <div class="flex">
                <div>
                  <button class="secondary approve" type="button" on:click={() => submit(2)}>Autoriser la publication</button>
                  <button class="secondary refuse" type="button" on:click={() => submit(1)}>Refuser la publication</button>
                  <button class="secondary close" type="button" on:click={() => (show = false)}>Fermer</button>
                </div>

                <label for="comments" style="margin-top: 20px">Commentaires</label>
                <input
                  type="text"
                  style="margin-bottom: 0"
                  bind:value={comments}
                  id="comments"
                  placeholder="Uniquement en cas de refus"
                />
              </div>
            </div>
          {:else}
            <div class="actions">
              <button class="secondary" type="button" on:click={() => (show = false)}>Fermer</button>
            </div>
          {/if}
        {/if}
      </div>

      <div class="preview">
        <p class="section-title"><strong>Aperçu</strong></p>
        <Post data={{ data: element, type: type }} preview />
      </div>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @use '../../../static/assets/sass/modal.scss';

  p.field,
  a.field {
    margin: 0 0 20px 0 !important;
    display: block;
    font-size: 16px;
  }

  a.field {
    display: inline-block;
  }

  div.flex {
    border: 1px solid #f0f0f0;
    border-radius: 5px;
    background: #fdfdfd;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-top: 30px;

    div {
      display: flex;
      flex-direction: row;
      gap: 15px;
    }
  }

  button.secondary {
    padding: 10px;
    margin-top: 30px;
  }

  button.approve,
  button.refuse,
  button.close {
    margin-top: 0;
    padding: 10px;

    &.approve {
      background-color: #defade;

      &:hover {
        background-color: #c0f5c0;

        &:active {
          background-color: #e5ffe5;
          color: black;
        }
      }
    }

    &.refuse {
      background-color: #fadede;

      &:hover {
        background-color: #f5c0c0;

        &:active {
          background-color: #ffe5e5;
          color: black;
        }
      }
    }
  }

  div.info {
    width: calc(100% - 42px);
    border-radius: 5px;
    padding: 15px 20px;
    margin-bottom: 30px;

    p {
      margin: 0;
      font-size: 14px;

      i {
        font-size: 13px;
      }
    }

    &.date {
      background-color: #d7e3f8;
      border: 1px solid #c7cde8;
      color: #27273f;
      margin-bottom: 20px;
    }

    &.draft {
      background-color: #f8f8f8;
      border: 1px solid #e8e8e8;
      color: #505050;
    }

    &.waiting {
      background-color: #faf0d2;
      border: 1px solid #eae0c2;
      color: #4d4737;
    }

    &.refused {
      background-color: #f8d7d7;
      border: 1px solid #e8c2c7;
      color: #432a2a;
    }

    &.approved {
      background-color: #d7f8d7;
      border: 1px solid #c7e8c7;
      color: #273f27;
    }

    button {
      float: right;
      width: 33px;
      opacity: 0.8;
      margin-top: 0;
    }
  }

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
    flex-direction: row;
    gap: 15px;
  }

  table.filling {
    width: 100%;
    border-collapse: collapse;
    // border-bottom: 2pt solid #f5f5f5;

    th,
    td {
      border: 1.5px solid #eaeaea;
    }

    thead tr {
      background-color: #f0f0f0;

      th {
        padding: 10px;
      }
    }

    p.field {
      margin: 5px !important;
      font-size: 14px;
    }

    tr {
      &:nth-of-type(1) th {
        border-bottom: 1pt solid #c0c0c0;
        text-align: center;
      }

      &:nth-of-type(2n) {
        background-color: #fafafa;
      }

      th:nth-of-type(1) {
        min-width: 45%;
        width: 45%;
        max-width: 45%;
      }

      th:nth-of-type(2) {
        width: 35%;
        max-width: 35%;
      }

      th:nth-of-type(3) {
        max-width: 45px;
        min-width: 45px;
        font-size: 11px;
      }
    }

    td.allow {
      text-align: center;
    }
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

    table.filling tr {
      th:nth-of-type(3) {
        max-width: 80px;
        min-width: 80px;
        font-size: 16px;
      }
    }
  }
</style>
