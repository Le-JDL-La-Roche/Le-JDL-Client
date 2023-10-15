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
  import { showAcceptCookies$, printAuthorization$ } from '$services/store'
  import ApiWebradioService from '$services/api/api-webradio.service'
  import type { Authorization } from '$models/data/authorization.model'
  import PageAuthorization from '$components/others/PageAuthorization.svelte'
  import PageMajorGuestAuthorization from '$components/others/PageMajorGuestAuthorization.svelte'
  import PageMinorGuestAuthorization from '$components/others/PageMinorGuestAuthorization.svelte'

  export let data: LayoutData

  const apiWebradio = new ApiWebradioService()

  let showPing: boolean = false
  let showPlayer: boolean = false
  let showCookies = data.acceptCookies ? false : true
  let checkInterval: NodeJS.Timeout

  let authorization: false | Authorization = false
  let type: false | 'emissions' | 'videos' | 'articles' = false
  let guestId: false | number = false
  let guestType: false | 'in' | 'out' = false

  $: if (data.show) {
    checkShow(data.show.streamId)
    if (!showPlayer) {
      checkInterval = setInterval(() => checkShow((data.show as WebradioShow).streamId), 5000)
    }
  } else {
    liveStream$.set(false)
    clearInterval(checkInterval)
  }

  io.on('waitStreamLaunched', (show: WebradioShow) => {
    data.show = show
    checkShow(data.show.streamId)
  })

  io.on('waitRestreamLaunched', (show: WebradioShow) => {
    data.show = show
    checkShow(data.show.streamId)
  })

  io.on('liveStreamLaunched', (show: WebradioShow) => {
    data.show = show
    checkShow(data.show.streamId)
  })

  io.on('liveRestreamLaunched', (show: WebradioShow) => {
    data.show = show
    checkShow(data.show.streamId)
  })

  io.on('liveStreamStopped', () => {
    data.show = false
    liveStream$.set(false)
  })

  io.on('liveRestreamStopped', () => {
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

  printAuthorization$.subscribe((value) => {
    if (value) {
      authorization = value.authorization
      type = value.type
      guestId = value.guestId
      guestType = value.guestType
    } else {
      authorization = false
      type = false
      guestId = false
      guestType = false
    }
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

{#if data.show}
  <!-- {#if showPlayer && data.show} -->
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

{#if authorization && type}
  <div class="pages">
    {#if guestId === false}
      <PageAuthorization bind:type bind:authorization bind:guestId bind:guestType />
    {:else if (guestType === 'in' && typeof authorization.content !== 'string' && 'inGuests' in authorization.content && authorization.content.inGuests[guestId].authorizationType === 'M') || (guestType === 'out' && typeof authorization.content !== 'string' && 'outGuests' in authorization.content && authorization.content.outGuests[guestId].authorizationType === 'M')}
      <PageMajorGuestAuthorization bind:guestId bind:guestType bind:authorization />
    {:else if (guestType === 'in' && typeof authorization.content !== 'string' && 'inGuests' in authorization.content && authorization.content.inGuests[guestId].authorizationType === 'm') || (guestType === 'out' && typeof authorization.content !== 'string' && 'outGuests' in authorization.content && authorization.content.outGuests[guestId].authorizationType === 'm')}
      <PageMinorGuestAuthorization bind:guestId bind:guestType bind:authorization />
    {/if}
  </div>
{/if}

<style lang="scss">
  div.pages {
    display: none;
  }

  @media print {
    :global {
      div.content {
        display: none !important;
      }

      div.pages {
        display: block !important;
      }

      header,
      nav,
      footer,
      p.error {
        display: none !important;
      }

      body {
        height: calc(2 * 29.685cm);
        min-height: calc(2 * 29.685cm);
        max-height: calc(2 * 29.6985cm);
      }

      div.page {
        margin: 0 auto !important;
        box-shadow: none !important;
        border: none !important;
        height: calc(29.685cm - 2 * 1.7cm) !important;
      }

      div.allow {
        break-inside: avoid;
      }

      div.add-modal {
        display: flex !important;
        flex-direction: column;
        gap: 0 !important;
        padding: 0 !important;
        background-color: white !important;
        border-radius: 0 !important;
        border: 0 !important;
      }
    }
  }
</style>
