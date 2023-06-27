<script lang="ts">
  export let podcastId = ''
</script>

<svelte:head>
  <script src="https://player.ausha.co/ausha-player.js"></script>
</svelte:head>

<iframe
  title="Ausha podcast player"
  frameborder="0"
  loading="lazy"
  src={`https://player.ausha.co/index.html?podcastId=${podcastId}&playlist=false&color=%2372238e&v=3&playerId=ausha-9xSP`}
/>

<style lang="scss">
  iframe {
    border: none;
    height: 500px;
  }
  
  @media screen and (min-width: 850px) {
    iframe {
      height: 220px;
      width: 100%;
    }
  }
</style>
