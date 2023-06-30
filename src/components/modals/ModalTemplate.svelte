<script lang="ts">
  import { cubicInOut } from 'svelte/easing'
  import { unscale } from '$services/transitions'

  export let size: 's' | 'm' | 'l' = 'm'
  export let show: boolean
</script>

{#if show}
  <div class="modal-background" transition:unscale>
    <div class={'modal size-' + size}>
      <section class="close">
        <button class="close secondary" on:click={() => (show = false)}><i class="fa-solid fa-times" /></button>
      </section>
      <slot />
    </div>
  </div>
{/if}

<style lang="scss">
  div.modal-background {
    background-color: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    transition: opacity 0.2s, background-color 0.2s, transform 0.2s, display 0s;
    z-index: 10000;
    display: flex;
    align-items: center;

    div.modal {
      width: calc(100% - 90px);
      max-height: calc(100% - 90px);
      overflow-y: auto;
      background-color: white;
      border-radius: 5px;
      box-shadow: 0 0 30px rgba(75, 75, 75, 0.3);
      border: 1px solid var(--light-gray-color);
      margin: 15px auto;
      padding: 30px;
      position: relative;
      transition: opacity 0.2s, background-color 0.2s, transform 0.2s, display 0s;

      &.size-l {
        width: calc(100% - 30px);
        height: calc(100% - 60px);
        margin: 15px;
        overflow-y: auto;
      }

      button.close {
        float: right;
        width: 31px;
        margin-top: 0;
      }
    }
  }

  @media screen and (min-width: 850px) {
    div.modal-background {
      div.modal {
        max-height: 300px;
        margin: 0 auto 75px auto;

        &.size-s {
          width: 400px;
        }

        &.size-m {
          width: 750px;
        }

        &.size-l {
          width: calc(100% - 60px);
          height: calc(100% - 120px);
          max-height: calc(100% - 120px);
          margin: 30px;
        }
      }
    }

    @media screen and (min-width: 1150px) {
      div.modal-background {
        div.modal {
          margin: 0 auto 150px auto;
          max-height: 500px;
        }
      }
    }
  }
</style>
