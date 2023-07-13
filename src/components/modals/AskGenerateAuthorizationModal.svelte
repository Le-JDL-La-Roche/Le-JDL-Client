<script lang="ts">
  import type { Article } from '$models/features/article.model'
  import type { Video } from '$models/features/video.model'
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import ModalTemplate from './ModalTemplate.svelte'

  export let show: boolean
  export let type: 'emissions' | 'videos' | 'articles'
  export let element: WebradioShow | Video | Article
</script>

<ModalTemplate size={'s'} bind:show>
  <h3>Générer une autorisation</h3>
  <p>
    Souhaitez-vous générer une autorisation de diffusion et/ou de publication pour {type === 'emissions'
      ? "l'émission"
      : type === 'videos'
      ? 'la vidéo'
      : "l'article"} <i>{element.title}</i>
  </p>
  <div class="actions">
    <button class="primary">Générer</button>
  </div>
</ModalTemplate>

<style lang="scss">
  @use '../../../static/assets/sass/modal.scss';
</style>
