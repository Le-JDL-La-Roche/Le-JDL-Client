<script lang="ts">
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import WebradioModal from '$components/modals/WebradioModal.svelte'

  export let show: WebradioShow

  let showWebradioModal = false

  let play = true
  let volume = 50
  let mute = false
  let showQuestions = false
</script>

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
      <span class="live">En direct</span>
      <span class="title">{show.title}</span>
    </p>

    <div class="actions">
      <button
        class="action"
        on:click={() => {
          showWebradioModal = true
          showQuestions = true
        }}
      >
        <i class="fa-solid fa-message" />
      </button>
      <button class="action" on:click={() => {showWebradioModal = true; showQuestions = false}}>
        <i class="fa-solid fa-expand" />
      </button>
    </div>
  </div>
</div>

<WebradioModal bind:show={showWebradioModal} webradioShow={show} bind:play bind:mute bind:volume bind:showQuestions />

<style lang="scss">
  div.container {
    flex-direction: row;
    background: var(--blue-color);
    padding: 0;
    position: sticky;
    top: 0;
    z-index: 1000;
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
    height: 6px;
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
