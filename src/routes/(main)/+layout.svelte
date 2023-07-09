<script lang="ts">
  import type { LayoutData } from './$types'
  import Header from '$components/layouts/Header.svelte'
  import WebradioPlayer from '$components/players/WebradioPlayer.svelte'
  import Footer from '$components/layouts/Footer.svelte'
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import io from '$services/api/socket.service'
  import { liveStream$ } from '$services/store'

  export let data: LayoutData

  io.on('liveStreamLaunched', (show: WebradioShow) => {
    data.show = show
    liveStream$.set(true)
  })
  
  io.on('liveStreamStopped', () => {
    data.show = false
    liveStream$.set(false)
  })
</script>

{#if data.show}
  <WebradioPlayer show={data.show} />
{/if}

<Header />

<div class="content">
  <slot />
</div>

<Footer />
