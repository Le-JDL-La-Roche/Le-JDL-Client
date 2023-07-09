<script lang="ts">
  import type { WebradioShow } from '$models/features/webradio-show.model'

  export let show: WebradioShow

  let play = false

  function playPause() {
    play = !play
  }
</script>

<div class="container">
  <div class="content">
    <button class="play" on:click={playPause}>
      <i class={'fa-solid ' + (play ? 'fa-pause' : 'fa-play')} />
    </button>
  </div>
</div>

<style lang="scss">
  div.container {
    display: flex;
    flex-direction: row;
    background: var(--blue-color);
    padding: 0;
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  button.play {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    margin: 0;
    padding: 16px 0 14px 0;
    width: 50px;

    i.fa-solid {
      color: white;
    }
  }
</style>
