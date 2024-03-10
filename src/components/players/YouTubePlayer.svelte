<script>
  // @ts-nocheck
  import { onMount } from 'svelte'

  export let player
  export let initialVideoId = ''

  export let play = false

  const ytPlayerId = 'youtube-player'

  onMount(() => {
    function load() {
      player = new YT.Player(ytPlayerId, {
        height: '100%',
        width: '100%',
        videoId: initialVideoId,
        // playerVars: { autoplay: 1 },
        host: 'https://www.youtube-nocookie.com',
        events: {
          onStateChange: (event) => {
            play = event.data == YT.PlayerState.PLAYING
            console.log(play)
          }
        }
      })
      console.log('player', player)
    }

    if (window.YT) {
      load()
    } else {
      window.onYouTubeIframeAPIReady = load
    }
  })
</script>

<svelte:head>
  <script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>

<div style="aspect-ratio: 16 / 9" class="yt-player">
  <div id={ytPlayerId} />
</div>

<style lang="scss">
  div.yt-player {
    border-radius: 3px;
    overflow: hidden;
  }
</style>
