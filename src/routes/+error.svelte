<script lang="ts">
  import Header from '$components/Header.svelte'
  import Footer from '$components/Footer.svelte'
  import { page } from '$app/stores'
</script>

<svelte:head>
  <title>404 Non trouvé • Le JDL - La Roche</title>
</svelte:head>

<Header />

<div class="content error">
  <h2>404</h2>
  <h3>Non trouvé</h3>
  <p>
    L'erreur <b>404 - Not found</b> signifie que la page que vous demandez n'existe pas !<br />
    Vérifiez l'URL que vous avez saisie.
  </p>
</div>

<Footer />
