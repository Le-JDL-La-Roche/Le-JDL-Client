<script lang="ts">
  function unload() {
    // sessionStorage.removeItem('VISITED')
  }
</script>

<svelte:window on:unload={unload} />

<slot />
