<script lang="ts">
  import type { Authorization, Guest } from '$models/data/authorization.model'
  import type { Article } from '$models/features/article.model'
  import type { Video } from '$models/features/video.model'
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import ModalTemplate from './ModalTemplate.svelte'
  import utils from '$services/utils'

  export let show: boolean

  export let showAddEditAuthorizationModal: boolean
  export let element: WebradioShow | Video | Article
  export let authorization: Authorization | undefined
  export let elementType: 'emissions' | 'videos' | 'articles'

  $: date = null as string | null

  $: if (show && authorization && authorization.responseDate) {
    date = new Date(+authorization.responseDate! * 1000).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  async function generate() {
    show = false
    await utils.sleep(300)
    showAddEditAuthorizationModal = true
  }
</script>

<ModalTemplate size={'s'} bind:show>
  <h3>Publication refusée</h3>
  <p>
    La publication de {elementType === 'emissions'
      ? "l'émission"
      : elementType === 'videos'
      ? 'la vidéo'
      : "l'article"} <i>{element.title}</i> a été refusée par {authorization?.manager} le {date}.
  </p>

  <p>
    <b>Motif :</b> {authorization?.comments}
  </p>
  <div class="actions">
    <button class="primary" on:click={generate}>Modifier la demande d'autorisation</button>
  </div>
</ModalTemplate>

<style lang="scss">
  @use '../../../static/assets/sass/modal.scss';
</style>
