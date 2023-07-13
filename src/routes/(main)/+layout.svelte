<script lang="ts">
  import type { LayoutData } from './$types'
  import Header from '$components/layouts/Header.svelte'
  import WebradioPlayer from '$components/players/WebradioPlayer.svelte'
  import Footer from '$components/layouts/Footer.svelte'
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import io from '$services/api/socket.service'
  import { liveStream$ } from '$services/store'
  import LivePing from '$components/others/LivePing.svelte'
  import { scale } from 'svelte/transition'

  export let data: LayoutData

  let showPing = data.show ? true : false

  io.on('liveStreamLaunched', (show: WebradioShow) => {
    data.show = show
    showPing = true
    liveStream$.set(true)
  })

  io.on('liveStreamStopped', () => {
    data.show = false
    liveStream$.set(false)
  })
</script>

{#if data.show}
      <WebradioPlayer show={data.show} questions={data.questions} />
{/if}

<Header />

<div class="content">
  <slot />
</div>

<Footer />

{#if showPing && data.show}
  <LivePing bind:webradioShow={data.show} bind:show={showPing} />
{/if}
