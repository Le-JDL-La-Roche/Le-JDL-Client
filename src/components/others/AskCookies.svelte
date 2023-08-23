<script lang="ts">
  import CookiesService from '$services/cookies.service'
  import { slide } from 'svelte/transition'
  import { showAcceptCookies$ } from '$services/store'

  export let show: boolean

  const cookies = new CookiesService()

  function accept() {
    cookies.add({ name: 'COOKIES', value: '1' })
    showAcceptCookies$.set(false)
    show = false
  }

  function decline() {
    cookies.add({ name: 'COOKIES', value: '0' })
    if (cookies.get('SHOW_ARTICLES')) {
      cookies.delete('SHOW_ARTICLES')
    }
    if (cookies.get('ORDER_BY')) {
      cookies.delete('ORDER_BY')
    }
    if (cookies.get('VOLUME')) {
      cookies.delete('VOLUME')
    }
    showAcceptCookies$.set(false)
    show = false
  }
</script>

<div class="cookies" transition:slide>
  <div class="content">
    <div class="header">
      <p class="title"><i class="fa-solid fa-cookie" />&nbsp;&nbsp;Nous utilisons les cookies</p>
      <div class="actions">
        <button class="primary accept" on:click={accept}>Accepter</button>
        <button class="secondary decline" on:click={decline}>Refuser</button>
        <a href="https://github.com/Le-JDL-La-Roche/Le-JDL-Client/blob/main/COOKIES.md#a-propos-des-cookies" target="_blank"
          >En savoir plus</a
        >
      </div>
    </div>
    <p>
      Le site du JDL utilise les cookies pour sauvegarder vos paramètres et mesurer l'audience. En aucun cas ces cookies ne
      peuvent vous identifier.<br />
      Si vous ne souhaitez pas sauvegarder vos paramètres, vous pouvez refuser les cookies.<br />
      Vous pouvez modifier votre choix à tout moment en cliquant sur le bouton correspondant en bas de la page.
    </p>
  </div>
</div>

<style lang="scss">
  div.cookies {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 1000;
  }

  div.content {
    box-shadow: 0 -3px 130px #000000a0;
    background: white;
    padding: 30px;
    margin-bottom: 15px;
    border-radius: 5px;
    border: 1px solid var(--border-color);
    width: calc(100% - 90px);
  }

  div.header {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 15px;

    div.actions {
      display: flex;
      align-items: center;
      gap: 15px;

      button {
        height: 37px;
        margin: 0;
        width: auto;
        flex: 1;

        &.accept {
          background: #06a135;
        }
      }
    }
  }

  p {
    margin: 0;
  }

  p.title {
    font-size: 18px;
    font-weight: bold;
    flex: 1;
  }

  @media screen and (min-width: 850px) {
    div.content {
      width: 750px;

      div.header {
        flex-direction: row;

        button {
          width: 100px;

          &.accept:hover {
            background: #0e702b;

            &:active {
              background: var(--light-gray-color);
            }
          }
        }
      }
    }

    @media screen and (min-width: 1150px) {
      div.content {
        width: 1050px;
      }
    }
  }
</style>
