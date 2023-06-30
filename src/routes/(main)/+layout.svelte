<script lang="ts">
  import Header from '$components/layouts/Header.svelte'
  import Footer from '$components/layouts/Footer.svelte'
</script>

<Header />

<div class="content">
  <slot />
</div>

<Footer />
