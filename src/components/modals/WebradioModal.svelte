<script lang="ts">
  import ModalTemplate from './ModalTemplate.svelte'
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import ContentService from '$services/content.service'
  import ApiWebradioService from '$services/api/api-webradio.service'
  import io from '$services/api/socket.service'
  import type { WebradioQuestion } from '$models/features/webradio-question.model'
  import utils from '$services/utils'
  import { onMount } from 'svelte'
  import YouTubePlayer from '$components/players/YouTubePlayer.svelte'

  export let show: boolean
  export let webradioShow: WebradioShow

  export let play: boolean
  export let volume: number
  export let mute: boolean
  export let showQuestions: boolean

  const content = new ContentService()

  let player: any
  let ytPlay: boolean = false

  $: if (ytPlay === true) {
    play = false
  }

  $: if (play === true) {
    player.pauseVideo()
  }
</script>

<ModalTemplate size={'l'} bind:show>
  <h3>{webradioShow.title}</h3>

  <div class="show-modal">
    <div class="info" class:showQuestions>
      <div class="show-content">
        <p class="section-title"><strong>Emission</strong></p>
        <div class="in-show-content">
          <YouTubePlayer bind:player bind:initialVideoId={webradioShow.streamId} bind:play={ytPlay} />
          <p class="description">
            {@html content.markdownToHtml(webradioShow.description)}
          </p>
        </div>
      </div>

      <div class="player">
        <div class="in-player">
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
        </div>
        <button class="secondary" on:click={() => (showQuestions = true)}
          >Tchat&nbsp;&nbsp;<i class="fa-solid fa-caret-right" /></button
        >
      </div>
    </div>

    <div class="questions" class:showQuestions>
      <div class="questions-header">
        <button class="secondary" on:click={() => (showQuestions = false)}><i class="fa-solid fa-caret-left" /></button>
        <p class="section-title"><strong>Questions</strong></p>
      </div>
      <!-- <p style="font-size: 14px; margin-top: 0">
        {#if webradioShow.status === 0.5 || webradioShow.status === -1.5}
          Vous ne pouvez pas poser de questions durant les rediffusions.
        {:else}
          Vous pouvez poser des questions depuis <a href="https://youtube.com/watch?v={webradioShow.streamId}">YouTube</a>.
        {/if}
      </p> -->
      
      <iframe src="https://www.youtube.com/live_chat?v={webradioShow.streamId}&embed_domain={window.location.hostname}" frameborder="0" title="Live chat" style="height: 100%"></iframe>
    </div>
  </div>
</ModalTemplate>

<style lang="scss">
  @use '../../../static/assets/sass/modal.scss';

  h3 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    max-height: 30px;
    line-clamp: 1;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }

  p.section-title {
    margin-top: 0;
  }

  div.show-modal {
    display: flex;
    flex-direction: row;
    gap: 30px;
    overflow-x: hidden;
    position: relative;
    height: calc(100% - 53px);
  }

  div.youtube {
    padding: 15px;
    border-radius: 5px;
    background-color: #ffe5e5;
    position: relative;
  }

  div.showQuestions {
    left: calc(-100% - 30px) !important;
  }

  div.info {
    order: -1;
    display: flex;
    flex-direction: column;
    min-width: 100%;
    width: 100%;
    left: 0;
    position: relative;
    transition: left 0.3s;

    div.show-content {
      flex: 1;
      height: calc(100% - 75px);

      div.in-show-content {
        height: calc(100% - 50px);
        overflow-y: auto;
      }
    }

    div.player {
      display: flex;
      align-items: center;
      flex-direction: row;

      div.in-player {
        display: flex;
        align-items: center;
        flex-direction: row;
        flex: 1;
      }

      div.in-player + button.secondary {
        width: auto;
      }
    }
  }

  div.questions {
    display: flex;
    flex-direction: column;
    min-width: 100%;
    width: 100%;
    left: 0;
    position: relative;
    transition: left 0.3s;

    div.questions-header {
      display: flex;
      flex-direction: row;
      gap: 15px;
      align-items: center;

      button.secondary {
        width: 35px;
        margin: 0 0 15px 0;
      }
    }

    div.questions-list {
      flex: 1;
      overflow-y: auto;
    }

    p.info {
      font-size: 14px;
      color: var(--dark-gray-color);
      margin: 0 7px 3px 0;
    }

    p.question-text {
      margin-top: 0;
    }

    form {
      display: flex;
      flex-direction: row;
      margin-top: 20px;
      flex-wrap: wrap;

      input {
        margin: 0 15px 0 0 !important;
        flex: 1;
        min-width: calc(100% - 72px) !important;
        max-width: calc(100% - 72px) !important;
        width: calc(100% - 72px) !important;
      }

      button {
        margin-top: 0;
        width: 35px;
      }
    }
  }

  button:not(.secondary) {
    color: var(--blue-color);
    border: none;
    background: none;
    cursor: pointer;
    line-height: 1;
    transition: all 0.3s;

    &.play {
      width: 50px;
      font-size: 18px;
      padding: 16px 0 14px 0;
      margin: 0 10px 0 0;
    }

    &.volume {
      width: 35px !important;
      flex: 35px;
      font-size: 16px;
      padding: 17px 0 16px 5px;
      margin: 0 5px 0 0;
      text-align: left;

      i.fa-solid {
        width: 23px;
      }
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
    background: var(--blue-color);
    outline: none;
    appearance: none;
    transition: all 0.3s;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #232e86;
      cursor: pointer;
    }

    &::-moz-range-thumb {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: #232e86;
      cursor: pointer;
    }
  }

  @media screen and (min-width: 850px) {
    div.showQuestions {
      left: 0 !important;
    }

    div.show-modal {
      &:before {
        content: '';
        border-left: 1px solid var(--light-gray-color);
        align-self: stretch;
      }

      div.info {
        flex: 1 1 60%;
        min-width: auto;
        width: auto;
        height: calc(100vh - 173px);

        div.in-player + button.secondary {
          display: none;
        }
      }

      div.questions {
        flex: 1 1 40%;
        min-width: auto;
        width: auto;

        div.questions-header {
          button.secondary {
            display: none;
          }
        }
      }
    }

    button:hover:not(.secondary) {
      color: #232e86;
    }

    div.volume:hover {
      width: 133px;

      input {
        opacity: 1;
      }
    }

    input[type='range']:hover {
      background: #232e86;
      border: none;
    }
  }
</style>
