<script lang="ts">
  import ModalTemplate from './ModalTemplate.svelte'
  import CookiesService from '$services/cookies.service'
  import { invalidateAll } from '$app/navigation'

  export let show: boolean

  const cookies = new CookiesService()

  $: showArticles = true
  $: orderBy = 'date'

  function submit() {
    if (cookies.get('COOKIES') === '1') {
      cookies.add({ name: 'SHOW_ARTICLES', value: showArticles + '' })
      cookies.add({ name: 'ORDER_BY', value: orderBy === 'title' ? 'title' : orderBy === 'type' ? 'type' : 'date' })
    }
    show = false
    invalidateAll()
  }

  $: if (show) {
    showArticles = cookies.get('SHOW_ARTICLES') === 'false' ? false : true
    orderBy = cookies.get('ORDER_BY') === 'title' ? 'title' : cookies.get('ORDER_BY') === 'type' ? 'type' : 'date'
  }
</script>

<ModalTemplate size={'s'} bind:show>
  <form on:submit|preventDefault={submit}>
    <h3>Filtrer et Trier</h3>

    {#if cookies.get('COOKIES') !== '1'}
      <p class="error">Vous devez accepter les cookies pour pouvoir filtrer et trier les vidéos et articles.</p>
    {/if}

    <p class="section-title">Filtrer :</p>
    <label for="show-videos" class="opt">
      <input type="checkbox" checked id="show-videos" disabled />&nbsp;&nbsp;Afficher les vidéos
    </label>
    <label for="show-articles" class="opt">
      <input type="checkbox" bind:checked={showArticles} id="show-articles" />&nbsp;&nbsp;Afficher les articles
    </label>

    <p class="section-title">Trier :</p>
    <label for="order-by-date" class="opt">
      <input type="radio" bind:group={orderBy} name="order" id="order-by-date" value="date" />&nbsp;&nbsp;Ordonner par date
    </label>
    <label for="order-by-type" class="opt"> 
      <input type="radio" bind:group={orderBy} name="order" id="order-by-type" value="type" />&nbsp;&nbsp;Ordonner par type
      (vidéos/articles)
    </label>
    <label for="order-by-title" class="opt">
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
