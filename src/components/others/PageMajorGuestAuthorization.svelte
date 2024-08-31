<script lang="ts">
  import type { Authorization, Guest, VideoAuthorization, WebradioAuthorization } from '$models/data/authorization.model'

  export let guestId: number
  export let guestType: 'in' | 'out'
  export let authorization: Authorization

  async function handlePaste(event: ClipboardEvent) {
    event.preventDefault()
    const text = event.clipboardData?.getData('text/plain')
    if (text) {
      document.execCommand('insertText', false, text)
    }
  }

  let guestAuthorization =
    guestType === 'in' 
      ? (authorization.content as WebradioAuthorization | VideoAuthorization).inGuests[guestId]
      : (authorization.content as WebradioAuthorization | VideoAuthorization).outGuests[guestId]
  
  $: if (guestAuthorization) {
    if (guestType === 'in') {
      (authorization.content as WebradioAuthorization | VideoAuthorization).inGuests[guestId] = guestAuthorization
    } else {
      (authorization.content as WebradioAuthorization | VideoAuthorization).outGuests[guestId] = guestAuthorization
    }      
  }
</script>

<p class="error">Utilisez un ordinateur pour créer ou modifier une autorisation.</p>

{#if 'content' in authorization && typeof authorization.content !== 'string' && 'outGuests' in authorization.content}
  <div class="add-modal">
    <div class="page" style="position: relative;">
      <div class="header">
        <!-- svelte-ignore a11y-missing-attribute -->
        <img src="/assets/images/la_roche_logo_full.png" height="50px" />
        <!-- svelte-ignore a11y-missing-attribute -->
        <img src="/assets/images/v2/logo.png" height="50px" style="float: right" />
        <h1>Autorisation de droit à l'image et au son</h1>
      </div>

      <p style="margin-top: 1.2cm">
        &nbsp;&nbsp;&nbsp;Conformément aux dispositions relatives au droit à l’image :<br />
        <br />
        &nbsp;&nbsp;&nbsp;Je, soussigné.e
        <span class="contenteditable" style="padding-left: 8cm !important; display: inline;">&nbsp;</span>, autorise Le Journal du
        Lycée La Rochefoucauld (Le JDL) à réaliser des captations audiovisuelles durant
        <span
          contenteditable="true"
          class="s"
          on:paste={handlePaste}
          bind:innerText={guestAuthorization.eventType}
        />
        ayant lieu le
        <span
          contenteditable="true"
          class="s"
          on:paste={handlePaste}
          bind:innerText={guestAuthorization.date}
        />
        <span
          contenteditable="true"
          class="s"
          on:paste={handlePaste}
          bind:innerText={guestAuthorization.place}
        />.<br />
        <br />
        &nbsp;&nbsp;&nbsp;Les images, vidéos ou enregistrements audio pourront être
        <span
          contenteditable="true"
          class="s"
          on:paste={handlePaste}
          bind:innerText={guestAuthorization.use}
        />, sans limitation de durée, entièrement ou par extraits, notamment sur
        <span
          contenteditable="true"
          class="s"
          on:paste={handlePaste}
          bind:innerText={guestAuthorization.media}
        />. Le JDL s'engage à ne pas exploiter les données susceptible de porter atteinte à ma vie privée ou à ma réputation.<br
        />
        <br />
        &nbsp;&nbsp;&nbsp;Je peux demander à tout moment la suppression de mes captations audiovisuelles en m'adressant par mail à
        <u>lejdl@laroche.org</u>.
      </p>

      <h3>Réserves</h3>

      <p style="margin: 0">
        <input type="checkbox" name="allow" class="allow" style="display: inline; text-align: left; width: auto" />&nbsp;&nbsp;Je ne
        souhaite pas apparaître visuellement lors de la diffusion/publication.<br />
        <input
          type="checkbox"
          name="allow"
          class="allow"
          style="display: inline; text-align: left; width: auto"
        />&nbsp;&nbsp;Autre :&nbsp;<span contenteditable="true" style="padding-left: 15.2cm !important; display: inline;" /><br />
        <br />
        &nbsp;&nbsp;&nbsp;Date et signature :
      </p>

      <div class="footer">
        Le JDL - La Rochefoucauld • <u>www.le-jdl-laroche.cf</u>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  @use '../../../static/assets/sass/page.scss';

  p {
    line-height: 2;
    font-size: 11pt;
  }

  span.s {
    font-size: 11pt !important;
    border: none !important;
    padding: 0 !important;
    color: var(--primary-red-color) !important;
    font-family: Bahnschrift !important;
    display: inline !important;
  }

  div.footer {
    position: absolute;
    bottom: 1cm;
    color: #505050;
    font-size: 9px;
    text-align: center;
    width: calc(21cm - 2 * 1.7cm);
  }

  @media print {
    div.add-modal {
      display: block;
      padding: 0;
      border: none !important;
      height: 29.685cm !important;
    }

    span.s {
      color: black !important;
    }

    :global {
      body {
        height: calc(29cm) !important;
        min-height: calc(29cm) !important;
        max-height: calc(29cm) !important;
      }
    }
  }
</style>
