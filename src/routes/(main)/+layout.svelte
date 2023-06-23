<script lang="ts">
  import Header from '$components/Header.svelte'
  import Footer from '$components/Footer.svelte'
</script>

<Header />

<div class="content">
  <slot />
</div>

<Footer />
