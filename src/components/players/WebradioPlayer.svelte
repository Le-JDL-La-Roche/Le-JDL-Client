<script lang="ts">
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import WebradioModal from '$components/modals/WebradioModal.svelte'
  import type { WebradioQuestion } from '$models/features/webradio-question.model'
  import CookiesService from '$services/cookies.service'
  import Hls from 'hls.js'
  import { onMount } from 'svelte'
  import io from '$services/api/socket.service'

  export let show: WebradioShow
  export let questions: WebradioQuestion[]

  const cookies = new CookiesService()

  let showWebradioModal = false

  let player: HTMLVideoElement

  let play = false
  let volume = 50
  let mute = false
  let showQuestions = false

  onMount(() => {
    if (Hls.isSupported()) {
      var hls = new Hls()
      player.muted = play && !mute
      hls.loadSource(`https://radio.le-jdl-laroche.cf/hls/${show.streamId}.m3u8`)
      hls.attachMedia(player)
      player.autoplay = true
      player.volume = volume / 100
    } else if (player.canPlayType('application/vnd.apple.mpegurl')) {
      player.muted = play && !mute
      player.src = `https://radio.le-jdl-laroche.cf/hls/${show.streamId}.m3u8`
      player.autoplay = true
      player.volume = volume / 100
    }
    
    if (cookies.get('VOLUME')) {
      volume = +cookies.get('VOLUME')
    }
    
    io.emit('addViewer')

    io.on('liveStreamStopped', () => {
      hls.destroy()
    })
  
    io.on('liveRestreamStopped', () => {
      hls.destroy()
    })
  })


  $: if (play && !mute && player) {
    player.muted = false
    io.emit('addViewer')
  } else if (player) {
    player.muted = true
    io.emit('removeViewer')
  }

  $: if (volume && player) {
    player.volume = volume / 100
    if (cookies.get('COOKIES') === '1') {
      cookies.add({ name: 'VOLUME', value: volume + '' })
    }
  } else if (player) {
    player.volume = 0
    if (cookies.get('COOKIES') === '1') {
      cookies.add({ name: 'VOLUME', value: volume + '' })
    }
  }
</script>

<svelte:window
  on:unload={() => {
    if (play && !mute) play = false
  }}
/>

<div class="container">
  <div class="content">
    <button class="play" on:click={() => (play = !play)}>
      <i class={'fa-solid ' + (play ? 'fa-pause' : 'fa-play')} />
    </button>

    <div class="volume">
      <button class="volume" on:click={() => (mute = !mute)}>
        <i
          class={'fa-solid ' +
            (volume >= 50 && !mute ? 'fa-volume-high' : volume > 0 && !mute ? 'fa-volume-low' : 'fa-volume-xmark')}
        />
      </button>
      <input type="range" bind:value={volume} min="0" max="100" on:click={() => (mute = false)} />
    </div>

    <p class="title">
      <span class="live">{
        show.status === -1 
        ? 'En attente du direct' 
        : show.status === -1.5
        ? 'En attente de rediffusion'
        : show.status === 0 
        ? 'En direct'
        : 'Rediffusion'
        }</span>
      <span class="title">{show.title}</span>
    </p>

    <div class="actions">
      {#if show.status === -1 || show.status === 0}
      <button
        class="action"
        on:click={() => {
          showWebradioModal = true
          showQuestions = true
        }}
      >
        <i class="fa-solid fa-message" />
      </button>
      {/if}
      <button
        class="action"
        on:click={() => {
          showWebradioModal = true
          showQuestions = false
        }}
      >
        <i class="fa-solid fa-expand" />
      </button>
    </div>
  </div>
</div>

<WebradioModal
  bind:show={showWebradioModal}
  webradioShow={show}
  bind:play
  bind:mute
  bind:volume
  bind:showQuestions
  bind:questions
/>

<!-- svelte-ignore a11y-media-has-caption -->
<video bind:this={player} controls />

<style lang="scss">
  div.container {
    flex-direction: row;
    background: var(--blue-color);
    padding: 0;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 5px 5px #00000030;
  }

  div.content {
    display: flex;
    align-items: center;
  }

  button {
    color: var(--light-gray-color);
    border: none;
    background: none;
    cursor: pointer;
    line-height: 1;
    transition: all 0.3s;

    &.play {
      width: 50px;
      font-size: 18px;
      padding: 22px 0 20px 0;
      margin: 0 10px 0 0;
    }

    &.volume {
      width: 35px !important;
      flex: 35px;
      font-size: 16px;
      padding: 23px 0 22px 5px;
      margin: 0 5px 0 0;
      text-align: left;

      i.fa-solid {
        width: 23px;
      }
    }

    &.action {
      display: block;
      width: 35px !important;
      flex: 35px;
      font-size: 16px;
      padding: 23px 0 22px;
      margin: 0;
    }
  }

  div.volume {
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    width: 30px;
    margin-right: 30px;
    transition: all 0.3s;

    input {
      opacity: 0;
    }
  }

  div.actions {
    width: 80px;
    display: flex;
    flex-direction: row;
  }

  input[type='range'] {
    padding: 0 !important;
    min-width: 100px;
    min-width: 100px;
    width: 100px;
    height: 6px !important;
    margin: 6px 0 6px 0;
    vertical-align: text-bottom;
    border: none;
    border-radius: 5px;
    background: var(--light-gray-color);
    outline: none;
    appearance: none;
    transition: all 0.3s;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
    }

    &::-moz-range-thumb {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
    }
  }

  p.title {
    color: white;
    margin: 10px 0;
    flex: 1;

    span.live {
      display: block;
      font-size: 16px;
      color: var(--light-gray-color);
    }

    span.title {
      display: none;
    }
  }

  video {
    display: none;
  }

  @media screen and (min-width: 850px) {
    button:hover {
      color: white;
    }

    div.volume:hover {
      width: 133px;

      input {
        opacity: 1;
      }
    }

    input[type='range']:hover {
      background: white;
      border: none;
    }

    p.title {
      span.live {
        font-size: 12px;
      }

      span.title {
        display: block;
      }
    }
  }
</style>
