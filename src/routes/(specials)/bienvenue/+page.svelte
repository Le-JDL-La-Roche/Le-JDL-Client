<script lang="ts">
</script>

<svelte:head>
  <title>Le JDL - La Roche</title>

  <meta name="title" content="Le JDL - La Roche">
  <meta name="twitter:title" content="Le JDL - La Roche">
  <meta property="og:title" content="Le JDL - La Roche">
  
  <meta name="description" content="Accéder aux différents réseaux du JDL.">
  <meta name="twitter:description" content="Accéder aux différents réseaux du JDL.">
  <meta property="og:description" content="Accéder aux différents réseaux du JDL.">
</svelte:head>

<div class="main">
  <div class="content">
    <img src="/assets/images/v2/logo_blanc.png" alt="Logo du JDL" />
    <h1>Le JDL</h1>
    <h2>Bienvenue !</h2>

    <a class="button" href="/">
      <i class="fa-solid fa-globe" />&nbsp;&nbsp;Accéder au site Web
    </a>
    <a class="button" href="https://instagram.com/lejdl.laroche">
      <i class="fa-brands fa-instagram" />&nbsp;&nbsp;Accéder au compte Instagram
    </a>
    <a class="button" href="https://www.youtube.com/channel/UCs3H_WZJogy8GnmrMNXjyPA">
      <i class="fa-brands fa-youtube" />&nbsp;&nbsp;Accéder à la chaîne YouTube
    </a>
    <a class="button" href="https://podcast.ausha.co/ecouter-la-roche">
      <i class="fa-solid fa-podcast" />&nbsp;&nbsp;Accéder aux podcasts (Ausha)
    </a>
    <a class="button" href="https://linkedin.com/company/le-jdl-laroche">
      <i class="fa-brands fa-linkedin" />&nbsp;&nbsp;Accéder à la page LinkedIn
    </a>
  </div>
</div>

<style lang="scss">
  div.main {
    background: linear-gradient(137deg, #606c88, #191654);
    min-height: calc(100vh - 50px);
    padding-top: 50px;
  }

  img {
    display: block;
    width: 75px;
    margin: 10px auto;
  }

  h1,
  h2 {
    margin: 0;
    color: white;
    text-align: center;
  }

  h1 {
    font-size: 64px;
    font-weight: 900;
  }

  h2 {
    margin-bottom: 50px;
  }

  a.button {
    display: block;
    width: 75%;
    margin: 20px auto;
    background-color: white;
    border-radius: 3px;
    padding: 10px;
    text-align: center;
    box-shadow: 0 0 15px rgb(50, 50, 50, 0.2);

    &:hover {
      box-shadow: 0 0 15px rgb(50, 50, 50, 1);

      &:active {
        box-shadow: none;
        transform: scale(97%);
      }
    }
  }
</style>
