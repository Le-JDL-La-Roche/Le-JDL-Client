<script lang="ts">
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import { scale } from 'svelte/transition'

  export let show: boolean
  export let webradioShow: WebradioShow
</script>

<div class="container" transition:scale={{ start: 0.5 }}>
  <button class="close secondary" on:click={() => (show = false)}><i class="fa-solid fa-times" /></button>
  <p class="on-air"><span>ON AIR</span><b>En direct !</b></p>
  <p>
    Nous serons en direct à {new Date(+webradioShow.date * 1000).getHours().toString().padStart(2, '0')}:{new Date(
      +webradioShow.date * 1000
    )
      .getMinutes()
      .toString()
      .padStart(2, '0')} !<br />Écoutez-nous !
  </p>
</div>

<style lang="scss">
  button.close {
    position: absolute;
    width: 33px;
    height: 33px;
    border-radius: 50rem;
    margin: 0;
    top: -15px;
    right: -15px;
  }

  div.container {
    border-radius: 5px;
    background-color: var(--blue-color);
    position: fixed;
    bottom: 30px;
    right: 30px;
    padding: 15px;
    box-shadow: 0 0 50px #000000a0;
    width: 230px;
    color: white;
  }

  p {
    margin: 10px 0 0 0;
  }

  p.on-air {
    margin: 0;

    span {
      display: inline-block;
      margin-right: 15px;
      padding: 5px 7px;
      border-radius: 3px;
      background-color: var(--primary-red-color);
      animation: flash 1s infinite;
    }
  }

  @keyframes flash {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
</style>
