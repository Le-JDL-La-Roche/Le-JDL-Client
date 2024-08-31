<script lang="ts">
  import type {
    ArticleAuthorization,
    Authorization,
    VideoAuthorization,
    WebradioAuthorization
  } from '$models/data/authorization.model'
  import type { Article } from '$models/features/article.model'
  import type { Video } from '$models/features/video.model'
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import MarkdownEditor from './MarkdownEditor.svelte'

  export let type: 'emissions' | 'videos' | 'articles'
  export let authorization: Authorization
  export let element: WebradioShow | Video | Article
  export let guestId: number | false
  export let guestType: 'in' | 'out' | false

  let allowDiv = ['']

  let date = null as string | null
  $: disabled = authorization.status !== -2 && authorization.status !== 1

  if (type === 'emissions') {
    allowDiv = ['', '']
    authorization.content = authorization.content as WebradioAuthorization
    date = new Date(+authorization.content.date * 1000).toISOString().split('T')[0]
  } else if (type === 'videos') {
    authorization.content = authorization.content as VideoAuthorization
  } else if (type === 'articles') {
    authorization.content = authorization.content as ArticleAuthorization
  }

  $: if (typeof authorization.content !== 'string' && 'inGuests' in authorization.content && authorization.content.inGuests) {
    const inGuests = authorization.content.inGuests
    const length = inGuests.length

    if (authorization.status !== -2 && authorization.status !== 1) {
      authorization.content.inGuests = authorization.content.inGuests.filter((guest) => guest.name !== '' || guest.status !== '')
    } else if (inGuests[length - 1]?.name !== '' || inGuests[length - 1]?.status !== '') {
      inGuests.push({
        name: '',
        status: '',
        authorization: false,
        authorizationType: false,
        eventType: "[l'émission de radio/l'enregistrement vidéo]",
        date: '[date]',
        place: '[au Lycée La Rochefoucauld (75007 PARIS)]',
        use: '[diffusés en direct et publiés après montage]',
        media: '[le site Web, le compte Instagram, la chaîne YouTube, le compte LinkedIn et les plateformes de streaming]'
      })
    } else if (
      inGuests[length - 1]?.name === '' &&
      inGuests[length - 1]?.status === '' &&
      length > 1 &&
      inGuests[length - 2]?.name === '' &&
      inGuests[length - 2]?.status === ''
    ) {
      inGuests.pop()
    }
  }

  $: if (typeof authorization.content !== 'string' && 'outGuests' in authorization.content && authorization.content.outGuests) {
    const outGuests = authorization.content.outGuests
    const length = outGuests.length

    if (authorization.status !== -2 && authorization.status !== 1) {
      authorization.content.outGuests = authorization.content.outGuests.filter(
        (guest) => guest.name !== '' || guest.status !== ''
      )
    } else if (outGuests[length - 1]?.name !== '' || outGuests[length - 1]?.status !== '') {
      outGuests.push({
        name: '',
        status: '',
        authorization: false,
        authorizationType: false,
        eventType: "[l'émission de radio/l'enregistrement vidéo]",
        date: '[date]',
        place: '[au Lycée La Rochefoucauld (75007 PARIS)]',
        use: '[diffusés en direct et publiés après montage]',
        media: '[le site Web, le compte Instagram, la chaîne YouTube, le compte LinkedIn et les plateformes de streaming]'
      })
    } else if (
      outGuests[length - 1]?.name === '' &&
      outGuests[length - 1]?.status === '' &&
      length > 1 &&
      outGuests[length - 2]?.name === '' &&
      outGuests[length - 2]?.status === ''
    ) {
      outGuests.pop()
    }
  }

  $: if (date && type === 'emissions') {
    ;(authorization.content as WebradioAuthorization).date = new Date(date).getTime() / 1000 + ''
  }
</script>

<p class="error">Utilisez un ordinateur pour créer ou modifier une autorisation.</p>

<div class="add-modal">
  {#if authorization.status > -2}
  <div class="info date">
    <p>
      <i class="fa-solid fa-calendar-days" />&nbsp;&nbsp;&nbsp;Autorisation demandée le
      <strong>{new Date(+(authorization.submitDate || 0) * 1000).toLocaleDateString('fr-fr')}</strong>.
      {#if authorization.status === 1 || authorization.status === 2}
        Réponse reçue le <strong>{new Date(+(authorization.responseDate || 0) * 1000).toLocaleDateString('fr-fr')}</strong>.
      {/if}
    </p>
  </div>
  {/if}
  <div
    class="info"
    class:draft={authorization.status == -2}
    class:waiting={authorization.status == -1}
    class:refused={authorization.status == 1}
    class:approved={authorization.status == 2}
  >
    {#if authorization.status == -2}
      <p>
        <i class="fa-solid fa-file-pen" />&nbsp;&nbsp;&nbsp;<strong>Brouillon</strong> — Cette demande d'autorisation de publication
        n'a pas encore été envoyée. Vous pouvez toujours la modifier.
      </p>
    {:else if authorization.status == -1}
      <p>
        <i class="fa-solid fa-hourglass-half" />&nbsp;&nbsp;&nbsp;<strong>En attente</strong> — Demande d'autorisation de publication
        envoyée. En attente de réponse. Vous ne pouvez plus la modifier.
      </p>
    {:else if authorization.status == 1}
      <p>
        <i class="fa-solid fa-ban" />&nbsp;&nbsp;&nbsp;<strong>Refusée</strong> — Demande d'autorisation de publication refusée
        par {authorization.manager}. Motif : <i>{authorization.comments}</i>. Vous devez modifier votre demande et la renvoyer.
      </p>
    {:else if authorization.status == 2}
      <p>
        <i class="fa-solid fa-check" />&nbsp;&nbsp;&nbsp;<strong>Acceptée</strong> — Demande d'autorisation de publication
        acceptée par {authorization.manager}. Vous pouvez publier {type === 'emissions'
          ? "l'émission"
          : type === 'videos'
          ? 'la vidéo'
          : "l'article"}.
      </p>
    {/if}
  </div>

  {#if typeof authorization.content !== 'string'}
    <p><strong>Présentation de {type === 'emissions' ? "l'émission" : type === 'videos' ? 'la vidéo' : "l'article"}</strong></p>

    <label for="title">Titre</label>
    <input type="text" placeholder="Titre" bind:value={element.title} disabled id="title" />

    <label for="subjects">{type === 'articles' ? 'Sujet' : 'Thème(s)'}</label>
    <input type="text" id="subjects" bind:value={authorization.content.subject} {disabled} required />

    {#if type === 'emissions' && 'estimatedDuration' in authorization.content}
      <div class="flex-date">
        <div style="flex: 1">
          <label for="date">Date de publication</label>
          <input type="date" id="date" bind:value={date} {disabled} required />
        </div>
        <div style="flex: 1">
          <label for="estimated-duration">Durée estimée</label>
          <input type="text" bind:value={authorization.content.estimatedDuration} id="estimated-duration" {disabled} required />
        </div>
      </div>
    {:else if type === 'videos' && 'type' in element && 'duration' in authorization.content}
      <label for="type">Publication sur</label>
      <input type="text" value={element.type === 'instagram' ? 'Instagram' : 'YouTube'} disabled />

      <div class="flex-date">
        <div style="flex: 1">
          <label for="duration">Durée</label>
          <input type="text" bind:value={authorization.content.duration} id="duration" required />
        </div>
        <div style="flex: 1">
          <label for="author">Auteur</label>
          <input type="text" bind:value={element.author} id="author" disabled />
        </div>
      </div>

      <label for="link">Lien de visionnage (video non répertoriée sur YouTube ou lien accessible sur OneDrive)</label>
      <input type="text" bind:value={authorization.content.link} id="link" {disabled} required />
    {:else if type === 'articles' && 'author' in element}
      <label for="author2">Auteur</label>
      <input type="text" bind:value={element.author} id="author2" disabled />
    {/if}

    {#if type !== 'articles' && 'inGuests' in authorization.content}
      <p style="margin-top: 10px"><strong>Intervenants de l'établissement</strong></p>

      <table class="filling">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Statut</th>
            <th class="image-right">Accord de droit à l'image</th>
            <th class="image-right generate">Générer</th>
          </tr>
        </thead>
        <tbody>
          {#each authorization.content.inGuests as guest, i}
            <tr>
              <td class="name">
                <input bind:value={guest.name} placeholder="Nom" style="margin-bottom: 0" {disabled} />
              </td>
              <td class="status">
                <input
                  bind:value={guest.status}
                  placeholder="Status (élève, professeur, ...)"
                  style="margin-bottom: 0"
                  {disabled}
                />
              </td>
              <td class="allow">
                <input type="checkbox" name="allow" class="allow page" bind:checked={guest.authorization} {disabled} />
              </td>
              <td class="allow generate">
                <button
                  class="secondary"
                  type="button"
                  on:click={() => {
                    let opt = document.getElementById('authorization-generate-inguest-' + i)
                    if (opt) opt.style.display = opt.style.display !== 'block' ? 'block' : 'none'
                  }}
                >
                  <div class="generate" id={'authorization-generate-inguest-' + i}>
                    <button
                      class="secondary"
                      type="button"
                      on:click={() => {
                        document.querySelector('div#modal__')?.scrollTo(0, 0)
                        guest.authorizationType = 'M'
                        guestType = 'in'
                        guestId = i
                      }}><i class="fa-solid fa-person" />&nbsp;&nbsp;Invité majeur</button
                    >
                    <button
                      class="secondary"
                      type="button"
                      on:click={() => {
                        document.querySelector('div#modal__')?.scrollTo(0, 0)
                        guest.authorizationType = 'm'
                        guestType = 'in'
                        guestId = i
                      }}><i class="fa-solid fa-child" />&nbsp;&nbsp;Invité mineur</button
                    >
                  </div>

                  <i class="fa-solid fa-ellipsis" />
                </button>
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
            <th class="image-right">Accord de droit à l'image</th>
            <th class="image-right generate">Générer</th>
          </tr>
        </thead>
        <tbody>
          {#each authorization.content.outGuests as guest, i}
            <tr>
              <td class="name">
                <input bind:value={guest.name} placeholder="Nom" style="margin-bottom: 0" {disabled} />
              </td>
              <td class="status">
                <input bind:value={guest.status} placeholder="Status (profession, ...)" style="margin-bottom: 0" {disabled} />
              </td>
              <td class="allow">
                <input type="checkbox" name="allow" class="allow page" bind:checked={guest.authorization} {disabled} />
              </td>
              <td class="allow generate">
                <button
                  class="secondary"
                  type="button"
                  on:click={() => {
                    let opt = document.getElementById('authorization-generate-inguest-' + i)
                    if (opt) opt.style.display = opt.style.display !== 'block' ? 'block' : 'none'
                  }}
                >
                  <div class="generate" id={'authorization-generate-outguest-' + i}>
                    <button
                      class="secondary"
                      type="button"
                      on:click={() => {
                        document.querySelector('div#modal__')?.scrollTo(0, 0)
                        guest.authorizationType = 'M'
                        guestType = 'out'
                        guestId = i
                      }}><i class="fa-solid fa-person" />&nbsp;&nbsp;Invité majeur</button
                    >
                    <button
                      class="secondary"
                      type="button"
                      on:click={() => {
                        document.querySelector('div#modal__')?.scrollTo(0, 0)
                        guest.authorizationType = 'm'
                        guestType = 'out'
                        guestId = i
                      }}><i class="fa-solid fa-child" />&nbsp;&nbsp;Invité mineur</button
                    >
                  </div>
                  <i class="fa-solid fa-ellipsis" />
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}

    <p style="margin-top: 30px"><strong>Synopsis</strong></p>

    <MarkdownEditor bind:value={authorization.content.synopsis} lite={2} {disabled} />
  {/if}
</div>

<style lang="scss">
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
  }

  input:disabled {
    background-color: var(--light-gray-color);

    &:hover {
      cursor: not-allowed;
      border: 1px solid var(--light-gray-color) !important;
    }
  }

  div.flex-date {
    display: flex;
    flex: 1;
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

    td.generate {
      position: relative;

      button {
        margin: 0;
        width: 50px;
        position: relative;
      }

      div.generate {
        position: absolute;
        width: 120px;
        padding: 7px;
        background-color: var(--mid-gray-color);
        top: 27px;
        right: 0px;
        border-radius: 5px 0 5px 5px;
        display: none;
        z-index: 1000;

        button {
          display: block;
          padding: 7px;
          width: 100%;
        }

        button:nth-of-type(1) {
          margin-bottom: 3px;
        }
      }
    }
  }

  div.add-modal {
    display: none;
  }

  @media screen and (min-width: 850px) {
    table.filling tr {
      th:nth-of-type(3) {
        max-width: 80px;
        min-width: 80px;
        font-size: 16px;
      }
    }

    p.error {
      display: none;
    }

    div.add-modal {
      display: block;
    }
  }
</style>
