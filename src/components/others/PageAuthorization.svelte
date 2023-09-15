<script lang="ts">
  import type {
    ArticleAuthorization,
    Authorization,
    VideoAuthorization,
    WebradioAuthorization
  } from '$models/data/authorization.model'

  export let type: 'emissions' | 'videos' | 'articles'
  export let authorization: Authorization
  export let guestId: number | false
  export let guestType: 'in' | 'out' | false

  let allowDiv = ['']

  let formattedDate: string | null = null

  if (type === 'emissions') {
    allowDiv = ['', '']
    authorization.content = authorization.content as WebradioAuthorization
    if (!isNaN(+authorization.content.date)) {
      const date = new Date(+authorization.content.date * 1000)
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
      const date_ = date.toLocaleDateString('fr-FR', options)
      formattedDate = `${date_.split(', ')[0]} à ${date_.split(', ')[1]}`
    } else {
      formattedDate = authorization.content.date
    }
  } else if (type === 'videos') authorization.content = authorization.content as VideoAuthorization
  else if (type === 'articles') authorization.content = authorization.content as ArticleAuthorization

  $: if (formattedDate && typeof authorization.content !== 'string' && 'date' in authorization.content) {
    authorization.content.date = formattedDate
  }

  async function handlePaste(event: ClipboardEvent) {
    event.preventDefault()
    const text = event.clipboardData?.getData('text/plain')
    if (text) {
      document.execCommand('insertText', false, text)
    }
  }

  function inGuests(event: Event) {
    if (typeof authorization.content !== 'string' && 'inGuests' in authorization.content) {
      const target = event.target as HTMLInputElement
      if (+target.value > authorization.content.inGuests.length) {
        authorization.content.inGuests.push({
          name: '',
          status: '',
          authorization: false,
          authorizationType: false,
          eventType: "[l'émission de radio/l'enregistrement vidéo]",
          date: '[date]',
          place: '[au Lycée La Rochefoucauld (75007 PARIS)]',
          use: '[diffusés en direct et publiés après montage]',
          media: '[le site Web, le compte Instagram, la chaîne YouTube, les plateformes de streaming]'
        })
      } else if (+target.value < authorization.content.inGuests.length) {
        authorization.content.inGuests.pop()
      }
      authorization.content.inGuests = authorization.content.inGuests
    }
  }

  function outGuests(event: Event) {
    if (typeof authorization.content !== 'string' && 'outGuests' in authorization.content) {
      const target = event.target as HTMLInputElement
      if (+target.value > authorization.content.outGuests.length) {
        authorization.content.outGuests.push({
          name: '',
          status: '',
          authorization: false,
          authorizationType: false,
          eventType: "[l'émission de radio/l'enregistrement vidéo]",
          date: '[date]',
          place: '[au Lycée La Rochefoucauld (75007 PARIS)]',
          use: '[diffusés en direct et publiés après montage]',
          media: '[le site Web, le compte Instagram, la chaîne YouTube, les plateformes de streaming]'
        })
      } else if (+target.value < authorization.content.outGuests.length) {
        authorization.content.outGuests.pop()
      }
      authorization.content.outGuests = authorization.content.outGuests
    }
  }
</script>

<p class="error">Utilisez un ordinateur pour créer ou modifier une autorisation.</p>

<div class="add-modal">
  <div class="page">
    <div class="header">
      <!-- svelte-ignore a11y-missing-attribute -->
      <img src="/assets/images/la_roche_logo_full.png" height="50px" />
      <!-- svelte-ignore a11y-missing-attribute -->
      <img src="/assets/images/v2/logo.png" height="50px" style="float: right" />
      <h1>Autorisation de diffusion et de publication</h1>
    </div>

    {#if typeof authorization.content !== 'string'}
      <h2>{type === 'emissions' ? 'Emission de radio' : type === 'videos' ? 'Vidéo' : 'Article'}</h2>

      <h3>Présentation de {type === 'emissions' ? "l'émission" : type === 'videos' ? 'la vidéo' : "l'article"}</h3>

      <table>
        <tr>
          <td style="width: 3.5cm">Titre :</td>
          <td>
            <span contenteditable="true" on:paste={handlePaste} bind:innerText={authorization.content.title} />
          </td>
        </tr>
        <tr>
          <td>{type === 'articles' ? 'Sujet' : 'Thème(s)'} :</td>
          <td><span contenteditable="true" on:paste={handlePaste} bind:innerText={authorization.content.subject} /></td>
        </tr>
        {#if type === 'emissions' && 'estimatedDuration' in authorization.content}
          <tr>
            <td>Date de diffusion :</td>
            <td>
              <span contenteditable="true" on:paste={handlePaste} bind:innerText={formattedDate} />
            </td>
          </tr>
          <tr>
            <td>Durée estimée :</td>
            <td>
              <span contenteditable="true" on:paste={handlePaste} bind:innerText={authorization.content.estimatedDuration} />
            </td>
          </tr>
        {:else if type === 'videos'}
          <tr>
            <td>Publication sur :</td>
            <td><span contenteditable="true" on:paste={handlePaste} /></td>
          </tr>
          <tr>
            <td>Auteur :</td>
            <td><span contenteditable="true" on:paste={handlePaste} /></td>
          </tr>
          <tr>
            <td>Durée :</td>
            <td><span contenteditable="true" on:paste={handlePaste} /></td>
          </tr>
        {:else if type === 'articles'}
          <tr>
            <td>Auteur :</td>
            <td><span contenteditable="true" on:paste={handlePaste} /></td>
          </tr>
        {/if}
      </table>

      {#if type !== 'articles' && 'inGuests' in authorization.content}
        <h3>
          Intervenants de l'établissement&nbsp;&nbsp;&nbsp;<input
            type="number"
            class="page"
            style="width: 1cm !important"
            min="0"
            max="10"
            value={authorization.content.inGuests.length}
            on:change={inGuests}
          />
        </h3>

        <table class="filling">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Statut</th>
              <th class="image-right">Accord de droit<br />à l'image et au son</th>
              <th class="image-right generate">Générer</th>
            </tr>
          </thead>
          <tbody>
            {#each authorization.content.inGuests as guest, i}
              <tr>
                <td class="name">
                  <span contenteditable="true" class="w" on:paste={handlePaste} bind:innerText={guest.name} />
                </td>
                <td class="status">
                  <span contenteditable="true" class="w" on:paste={handlePaste} bind:innerText={guest.status} />
                </td>
                <td class="allow">
                  <input type="checkbox" name="allow" class="allow page" bind:checked={guest.authorization} />
                </td>
                <td class="allow generate">
                  <div class="generate" id={'authorization-generate-inguest-' + i}>
                    <button
                      class="secondary"
                      on:click={() => {
                        document.querySelector('div#modal__')?.scrollTo(0, 0)
                        guest.authorizationType = 'M'
                        guestType = 'in'
                        guestId = i
                      }}><i class="fa-solid fa-person" />&nbsp;&nbsp;Invité majeur</button
                    >
                    <button
                      class="secondary"
                      on:click={() => {
                        document.querySelector('div#modal__')?.scrollTo(0, 0)
                        guest.authorizationType = 'm'
                        guestType = 'in'
                        guestId = i
                      }}><i class="fa-solid fa-child" />&nbsp;&nbsp;Invité mineur</button
                    >
                  </div>
                  <button
                    class="secondary"
                    type="button"
                    on:click={() => {
                      let opt = document.getElementById('authorization-generate-inguest-' + i)
                      if (opt) opt.style.display = opt.style.display !== 'block' ? 'block' : 'none'
                    }}
                  >
                    <i class="fa-solid fa-ellipsis" />
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}

      {#if type !== 'articles' && 'outGuests' in authorization.content}
        <h3>
          Intervenants extérieurs&nbsp;&nbsp;&nbsp;<input
            type="number"
            class="page"
            style="width: 1cm !important"
            min="0"
            max="10"
            value={authorization.content.outGuests.length}
            on:change={outGuests}
          />
        </h3>

        <table class="filling">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Statut</th>
              <th class="image-right">Accord de droit<br />à l'image et au son</th>
              <th class="image-right generate">Générer</th>
            </tr>
          </thead>
          <tbody>
            {#each authorization.content.outGuests as guest, i}
              <tr>
                <td class="name">
                  <span contenteditable="true" class="w" on:paste={handlePaste} bind:innerText={guest.name} />
                </td>
                <td class="status">
                  <span contenteditable="true" class="w" on:paste={handlePaste} bind:innerText={guest.status} />
                </td>
                <td class="allow">
                  <input type="checkbox" name="allow" class="allow page" bind:checked={guest.authorization} />
                </td>
                <td class="allow generate">
                  <div class="generate" id={'authorization-generate-outguest-' + i}>
                    <button
                      class="secondary"
                      on:click={() => {
                        document.querySelector('div#modal__')?.scrollTo(0, 0)
                        guest.authorizationType = 'M'
                        guestType = 'out'
                        guestId = i
                      }}><i class="fa-solid fa-person" />&nbsp;&nbsp;Invité majeur</button
                    >
                    <button
                      class="secondary"
                      on:click={() => {
                        document.querySelector('div#modal__')?.scrollTo(0, 0)
                        guest.authorizationType = 'm'
                        guestType = 'out'
                        guestId = i
                      }}><i class="fa-solid fa-child" />&nbsp;&nbsp;Invité mineur</button
                    >
                  </div>
                  <button
                    class="secondary"
                    type="button"
                    on:click={() => {
                      let opt = document.getElementById('authorization-generate-outguest-' + i)
                      if (opt) opt.style.display = opt.style.display !== 'block' ? 'block' : 'none'
                    }}
                  >
                    <i class="fa-solid fa-ellipsis" />
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}

      <h3>Synopsis</h3>

      <span contenteditable="true" on:paste={handlePaste} bind:innerText={authorization.content.synopsis} />
    {/if}
  </div>

  <div class="page">
    {#each allowDiv as a, i}
      <div class="allow">
        <h3>
          Autorisation de {type === 'emissions' ? (i === 0 ? 'diffusion en direct' : 'publication en podcast') : 'publication'}
        </h3>

        <table class="allow">
          <tr>
            <td>
              <h4>
                Responsable :&nbsp;&nbsp;<span
                  style="display: inline-block; width: 3cm; min-width: 3.5cm; padding-top: 0"
                  class="contenteditable m"
                  >&nbsp;
                </span>
              </h4>

              <p>
                <span style="color: #007233">
                  <input type="radio" name="allow" />&nbsp;&nbsp;{type === 'emissions'
                    ? i === 0
                      ? 'Diffusion en direct'
                      : 'Publication en podcast'
                    : 'Publication'} autorisée
                </span>
                <br />
                <span style="color: #6e0d00">
                  <input type="radio" name="allow" />&nbsp;&nbsp;{type === 'emissions'
                    ? i === 0
                      ? 'Diffusion en direct'
                      : 'Publication en podcast'
                    : 'Publication'} refusée
                </span>
                <br />
                <br />
                Motif/Commentaires :<br />
                <br />
                <br />
                <span class="contenteditable m">&nbsp;</span>
              </p>

              <p style="margin-top: 18px">
                Date et signature :<br />
                <br />
                <br />
                <br />
              </p>
            </td>
            <td>
              <h4>Direction</h4>

              <p>
                <span style="color: #007233">
                  <input type="radio" name="allow" />&nbsp;&nbsp;{type === 'emissions'
                    ? i === 0
                      ? 'Diffusion en direct'
                      : 'Publication en podcast'
                    : 'Publication'} autorisée
                </span><br />
                <span style="color: #6e0d00">
                  <input type="radio" name="allow" />&nbsp;&nbsp;{type === 'emissions'
                    ? i === 0
                      ? 'Diffusion en direct'
                      : 'Publication en podcast'
                    : 'Publication'} refusée
                </span>
                <br />
                <br />
                Motif/Commentaires :<br />
                <br />
                <br />
                <span class="contenteditable m">&nbsp;</span>
              </p>

              <p style="margin-top: 18px">
                Date et signature :<br />
                <br />
                <br />
                <br />
              </p>
            </td>
          </tr>
        </table>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  @use '../../../static/assets/sass/page.scss';

  td.generate {
    position: relative;

    button {
      margin: 0;
      padding: 3px 0;
    }

    div.generate {
      position: absolute;
      width: 120px;
      padding: 7px;
      background-color: var(--mid-gray-color);
      top: 25px;
      left: 3px;
      border-radius: 0 5px 5px 5px;
      display: none;
      z-index: 1000;

      button {
        padding: 5px;
      }

      button:nth-of-type(1) {
        margin-bottom: 3px;
      }
    }
  }

  @media print {
    th.generate,
    td.generate {
      display: none;
    }
  }
</style>
