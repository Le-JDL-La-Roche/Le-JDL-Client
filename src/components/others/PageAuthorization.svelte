<script lang="ts">
  import type {
    ArticleAuthorization,
    Authorization,
    GuestAuthorization,
    VideoAuthorization,
    WebradioAuthorization
  } from '$models/data/authorization.model'
  import utils from '$services/utils'
  import ContentService from '$services/content.service'

  export let type: 'emissions' | 'videos' | 'articles' | 'guest'
  export let authorization: Authorization

  const content = new ContentService()

  if (type === 'emissions') authorization.content = authorization.content as WebradioAuthorization
  else if (type === 'videos') authorization.content = authorization.content as VideoAuthorization
  else if (type === 'articles') authorization.content = authorization.content as ArticleAuthorization
  else authorization.content = authorization.content as GuestAuthorization

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
        authorization.content.inGuests.push({ name: '', status: '', authorization: false })
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
        authorization.content.outGuests.push({ name: '', status: '', authorization: false })
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
    <header>
      <!-- svelte-ignore a11y-missing-attribute -->
      <img src="/assets/images/la_roche_logo_full.png" height="50px" />
      <!-- svelte-ignore a11y-missing-attribute -->
      <img src="/assets/images/v2/logo.png" height="50px" style="float: right" />
      <h1>Autorisation de diffusion et de publication</h1>
    </header>

    {#if type !== 'guest' && typeof authorization.content !== 'string' && 'synopsis' in authorization.content }
      <h2>{type === 'emissions' ? 'Emission de radio' : type === 'videos' ? 'Vidéo' : 'Article'}</h2>

      <h3>Présentation de {type === 'emissions' ? "l'émission" : type === 'videos' ? 'la vidéo' : "l'article"}</h3>

      <table>
        <tr>
          <td style="width: 3.5cm">Titre :</td>
          <td
            ><span contenteditable="true" on:paste={handlePaste}
              >{'title' in authorization.content ? authorization.content.title : ''}</span
            >
          </td>
        </tr>
        <tr>
          <td>{type === 'articles' ? 'Sujet' : 'Thème(s)'} :</td>
          <td><span contenteditable="true" on:paste={handlePaste} /></td>
        </tr>
        {#if type === 'emissions' && 'estimatedDuration' in authorization.content}
          <tr>
            <td>Date de diffusion :</td>
            <td
              ><span contenteditable="true" on:paste={handlePaste}
                >{utils.timestampToString(+authorization.content.date)} à {utils.timestampToHour(
                  +authorization.content.date
                )}</span
              ></td
            >
          </tr>
          <tr>
            <td>Durée estimée :</td>
            <td><span contenteditable="true" on:paste={handlePaste}>{authorization.content.estimatedDuration} mn</span></td>
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
            </tr>
          </thead>
          <tbody>
            {#each authorization.content.inGuests as guest}
              <tr>
                <td class="name"><span contenteditable="true" class="w" on:paste={handlePaste}>{guest.name}</span></td>
                <td class="status"><span contenteditable="true" class="w" on:paste={handlePaste}>{guest.status}</span></td>
                <td class="allow"><input type="checkbox" name="allow" class="allow page" bind:checked={guest.authorization} /></td
                >
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}

      {#if type !== 'articles' && 'outGuests' in authorization.content}
        <h3>
          Intervenants de l'établissement&nbsp;&nbsp;&nbsp;<input
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
            </tr>
          </thead>
          <tbody>
            {#each authorization.content.outGuests as guest}
              <tr>
                <td class="name"><span contenteditable="true" class="w" on:paste={handlePaste}>{guest.name}</span></td>
                <td class="status"><span contenteditable="true" class="w" on:paste={handlePaste}>{guest.status}</span></td>
                <td class="allow"><input type="checkbox" name="allow" class="allow page" bind:checked={guest.authorization} /></td
                >
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}

      <h3>Synopsis</h3>

      <span contenteditable="true">{@html content.replaceNewLineByBr(authorization.content.synopsis)}</span>
    {/if}
  </div>

  <div class="page">
    <p />
  </div>
</div>

<style lang="scss">
  div.add-modal {
    display: none;
  }

  div.page {
    width: calc(21cm - 2 * 1.7cm);
    margin: 0 auto;
    padding: 1.7cm;
    background-color: white;
    height: calc(29.7cm - 2 * 1.7cm);
    border: 1px solid var(--light-gray-color);
    box-shadow: 0 0 10px var(--light-gray-color);

    header {
      position: relative;
      top: -0.5cm;
    }

    h1 {
      font-size: 24pt;
      margin-top: 1.1cm;
      margin-bottom: 0.5cm;
      line-height: 0;
    }

    h2 {
      font-size: 18pt;
      margin: 0 0 1.5cm 0;
      line-height: 0;
    }

    h3 {
      margin-top: 0.75cm;
      margin-bottom: 0.4cm;
      font-size: 13pt;
    }

    h4 {
      font-size: 11pt;
    }

    span[contenteditable='true'] {
      padding: 0.1cm 0.1cm 0cm 0.1cm;
      border-bottom: 1px dashed #707070;
      display: inline-block;
      width: calc(100% - 0.2cm);
      font-family: 'Calibri';
      font-size: 11pt;
      color: #4472c4;
      line-height: 1.4;
      outline: none;

      * {
        font-family: 'Calibri';
        color: #4472c4;
      }

      &.m {
        margin-left: 0;
      }
    }

    td span[contenteditable='true']:not(.w):not(.m) {
      margin-left: 0.5cm;
      width: auto;
      min-width: 5cm;
    }

    table {
      width: 100%;

      h4 {
        margin-top: 5px;
      }

      &.allow {
        border-collapse: collapse;
        table-layout: fixed;
        width: 100%;
        margin-top: 0.6cm;

        tr {
          td:nth-of-type(1) {
            padding-right: 0.4cm;
            width: calc(50% - 0.4cm);
            border-right: 1px solid #5e5e5e;
          }

          td:nth-of-type(2) {
            padding-left: 0.4cm;
          }
        }
      }

      &.filling {
        border-bottom: 2pt solid #f5f5f5;

        thead tr {
          background-color: #f5f5f5;
        }

        tr {
          &:nth-of-type(1) th {
            border-bottom: 1pt solid #505050;
          }

          &:nth-of-type(2n) {
            background-color: #f5f5f5;
          }

          th:nth-of-type(1) {
            min-width: 45%;
            width: 45%;
            max-width: 45%;
          }

          th:nth-of-type(2) {
            min-width: 35%;
            width: 35%;
            max-width: 35%;
          }
        }
      }
    }

    th,
    td {
      font-size: 10pt;
      line-height: 1.4;
    }

    th {
      font-size: 11pt;
      padding: 0.1cm;

      &.image-right {
        font-size: 8pt !important;
      }
    }

    td {
      height: 11pt;
      padding: 0;

      &.name,
      &.status,
      &.allow {
        padding: 0.1cm;
      }
      &.allow {
        text-align: center;
      }
    }
  }

  section.allow {
    padding: 0.6cm;
    border: 1px solid rgb(71, 71, 71);
    border-radius: 0.15cm;

    h3:nth-of-type(1) {
      margin-top: 0;
    }
  }

  input:not([type='radio']) {
    display: inline;
    padding: 0.1cm 0.1cm 0cm 0.1cm;
    border: none;
    border-bottom: 1px dashed #707070;
    display: inline-block;
    width: calc(100% - 0.2cm);
    font-family: 'Calibri';
    font-size: 11pt;
    color: #4472c4;
    line-height: 1.4;
    outline: none;
  }

  input[type='checkbox'].allow {
    display: inline-block;
    transform: scale(110%);
    text-align: center;
    margin-left: 0;
  }

  @media screen and (min-width: 850px) {
    p.error {
      display: none;
    }

    div.add-modal {
      display: flex;
      flex-direction: column;
      gap: 15px;
      padding: 20px;
      background-color: var(--background-gray-color);
      border-radius: 5px;
      border: 1px solid var(--light-gray-color);
    }
  }
</style>
