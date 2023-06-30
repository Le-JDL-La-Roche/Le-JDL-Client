<script lang="ts">
  import ModalTemplate from './ModalTemplate.svelte'
  import CookiesService from '$services/cookies.service'
  import { invalidateAll } from '$app/navigation'

  export let show: boolean

  const cookies = new CookiesService()

  $: showArticles = true
  $: orderBy = 'date'

  function submit() {
    cookies.add({ name: 'SHOW_ARTICLES', value: showArticles + '' })
    cookies.add({ name: 'ORDER_BY', value: orderBy === 'title' ? 'title' : orderBy === 'type' ? 'type' : 'date' })
    show = false
    invalidateAll()
  }

  $: if (show) {
    showArticles = cookies.get('SHOW_ARTICLES') === 'true'
    orderBy = cookies.get('ORDER_BY') === 'title' ? 'title' : cookies.get('ORDER_BY') === 'type' ? 'type' : 'date'
  }
</script>

<ModalTemplate size={'s'} bind:show>
  <form on:submit|preventDefault={submit}>
    <h3>Filtrer et Trier</h3>

    <p class="section-title">Filtrer :</p>
    <label for="show-videos">
      <input type="checkbox" checked id="show-videos" disabled />&nbsp;&nbsp;Afficher les vidéos
    </label>
    <label for="show-articles">
      <input type="checkbox" bind:checked={showArticles} id="show-articles" />&nbsp;&nbsp;Afficher les articles
    </label>

    <p class="section-title">Trier :</p>
    <label for="order-by-date">
      <input type="radio" bind:group={orderBy} name="order" id="order-by-date" value="date" />&nbsp;&nbsp;Ordonner par date
    </label>
    <label for="order-by-type">
      <input type="radio" bind:group={orderBy} name="order" id="order-by-type" value="type" />&nbsp;&nbsp;Ordonner par type
      (vidéos/articles)
    </label>
    <label for="order-by-title">
      <input type="radio" bind:group={orderBy} name="order" id="order-by-title" value="title" />&nbsp;&nbsp;Ordonner par titre
      (A-Z)
    </label>

    <div class="actions">
      <button class="primary">Filtrer et Trier</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @use '../../../static/assets/sass/modal.scss';
</style>
