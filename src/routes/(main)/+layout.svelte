<script lang="ts">
  import type { LayoutData } from './$types'
  import Header from '$components/layouts/Header.svelte'
  import WebradioPlayer from '$components/players/WebradioPlayer.svelte'
  import Footer from '$components/layouts/Footer.svelte'
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import io from '$services/api/socket.service'
  import { liveStream$ } from '$services/store'
  import LivePing from '$components/others/LivePing.svelte'
  import AskCookies from '$components/others/AskCookies.svelte'
  import { showAcceptCookies$ } from '$services/store'
  import ApiWebradioService from '$services/api/api-webradio.service'

  export let data: LayoutData

  const apiWebradio = new ApiWebradioService()

  let showPing: boolean = false
  let showPlayer: boolean = false
  let showCookies = data.acceptCookies ? false : true
  let checkInterval: NodeJS.Timeout

  $: if (data.show) {
    checkShow(data.show.streamId)
    if (!showPlayer) {
      checkInterval = setInterval(() => checkShow((data.show as WebradioShow).streamId), 5000)
    }
  } else {
    liveStream$.set(false)
    clearInterval(checkInterval)
  }

  io.on('liveStreamLaunched', (show: WebradioShow) => {
    data.show = show
    checkShow(data.show.streamId)
  })

  io.on('liveStreamStopped', () => {
    data.show = false
    liveStream$.set(false)
  })

  showAcceptCookies$.subscribe((value) => {
    showCookies = value
  })

  liveStream$.subscribe((value) => {
    showPlayer = value
    showPing = value
  })

  async function checkShow(streamId: string) {
    ;(await apiWebradio.checkStream(streamId)).subscribe({
      next: () => {
        liveStream$.set(true)
        clearInterval(checkInterval)
      },
      error: (err) => {
        liveStream$.set(false)
      }
    })
  }
</script>

{#if showPlayer && data.show}
  <WebradioPlayer show={data.show} questions={data.questions} />
{/if}

<Header />

<div class="content">
  <slot />
</div>

<Footer />

{#if showCookies}
  <AskCookies show={showCookies} />
{/if}

{#if showPing && data.show}
  <LivePing bind:webradioShow={data.show} bind:show={showPing} />
{/if}
