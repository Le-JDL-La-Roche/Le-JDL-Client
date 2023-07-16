<script lang="ts">
  import type { Authorization, Guest } from '$models/data/authorization.model'
  import type { Article } from '$models/features/article.model'
  import type { Video } from '$models/features/video.model'
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import ModalTemplate from './ModalTemplate.svelte'
  import utils from '$services/utils'

  export let show: boolean

  export let showAddEditAuthorizationModal: boolean
  export let authorizationModalElement: WebradioShow | Video | Article
  export let authorizationModalType: 'emissions' | 'videos' | 'articles'
  export let authorizationModalAction: { action: 'add' } | { action: 'edit'; authorization: Authorization }

  async function generate() {
    show = false
    await utils.sleep(300)
    showAddEditAuthorizationModal = true
  }
</script>

<ModalTemplate size={'s'} bind:show>
  <h3>Générer une autorisation</h3>
  <p>
    Souhaitez-vous générer une autorisation de diffusion et/ou de publication pour {authorizationModalType === 'emissions'
      ? "l'émission"
      : authorizationModalType === 'videos'
      ? 'la vidéo'
      : "l'article"} <i>{authorizationModalElement.title}</i> ?
  </p>
  <div class="actions">
    <button class="primary" on:click={generate}>Générer</button>
  </div>
</ModalTemplate>

<style lang="scss">
  @use '../../../static/assets/sass/modal.scss';
</style>
