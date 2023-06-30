<script lang="ts">
  import { page } from '$app/stores'
  import Header from '$components/layouts/Header.svelte'
  import Footer from '$components/layouts/Footer.svelte'

  const error: any = {
    '404': `L'erreur <b>404 - Not found</b> signifie que la page que vous demandez n'existe pas !<br />
    Vérifiez l'URL que vous avez saisie.`,
    '500': `L'erreur <b>500 - Internal server error</b> signifie que le serveur a rencontré une erreur inattendue.<br />
    Essayez de recharger la page.`
  }
</script>

<svelte:head>
  <title>{$page.status} {$page.error?.message} • Le JDL - La Roche</title>
</svelte:head>

<Header />

<div class="content error">
  <h2>{$page.status}</h2>
  <h3>{$page.error?.message}</h3>
  <p>
    {@html error[$page.status]}
  </p>
</div>

<Footer />
