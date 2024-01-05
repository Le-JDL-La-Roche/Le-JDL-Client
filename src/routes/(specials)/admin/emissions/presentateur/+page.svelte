<script lang="ts">
  import { goto } from '$app/navigation'
  import type { PageData } from './$types'
  import ApiWebradioService from '$services/api/api-webradio.service'
  import io from '$services/api/socket.service'
  import utils from '$services/utils'
  import { onMount } from 'svelte'
  import type { WebradioShow } from '$models/features/webradio-show.model'
  import CookiesService from '$services/cookies.service'

  export let data: PageData

  const apiWebradio = new ApiWebradioService()
  const cookies = new CookiesService()

  let fontSize = 64
  let speed = 50
  let mode = 0
  let addLine = 0
  let addPrompt = 0
  let reverse = false
  let currentScene = 'Chargement...'

  $: messages = [] as { type: 'p' | 'm'; message: string }[]

  let inputValue = ''

  onMount(() => window.scrollTo(0, document.body.scrollHeight))

  async function deleteQuestion(id: number) {
    ;(await apiWebradio.deleteQuestion(id)).subscribe({
      next: (res) => {
        data.questions = res.body.data?.questions || []
        io.emit('question')
      }
    })
  }

  io.on('showUpdated', async () => {
    ;(await apiWebradio.getCurrentShow()).subscribe({
      next: (res) => {
        data.show = res.body.data?.show as WebradioShow
      }
    })
  })

  io.on('prompterSettingsReset', () => {
    fontSize = 64
    speed = 50
    mode = 0
    reverse = false
  })

  io.on('sceneUpdated', (scene: string) => {
    currentScene = scene
  })

  io.on('updateQuestions', async (questions: any) => {
    data.questions = questions
    await utils.sleep(50)
    const div = document.querySelector('div.questions div.inner')!
    div.scrollTop = div.scrollHeight
  })

  io.on('messageSentToPresenter', async (message: string) => {
    messages.push({ type: 'm', message })
    messages = messages
    await utils.sleep(50)
    const div = document.querySelector('div.messages div.inner')!
    div.scrollTop = div.scrollHeight
  })

  io.emit('askScene')

  function updatePrompterSettings() {
    io.emit('updatePrompterSettings', {
      jwt: cookies.get('JWT'),
      settings: { fontSize, speed, mode, reverse, addPrompt, addLine }
    })
    addPrompt = 0
    addLine = 0
  }

  async function sendMessage() {
    if (inputValue.replaceAll(' ', '') !== '') {
      io.emit('sendMessageToManager', { jwt: cookies.get('JWT'), data: inputValue })
      messages.push({ type: 'p', message: inputValue })
      messages = messages
      inputValue = ''
      await utils.sleep(50)
      const div = document.querySelector('div.messages div.inner')!
      div.scrollTop = div.scrollHeight
    }
  }
</script>

<svelte:head>
  <title>Présentateur • Le JDL - La Roche</title>
</svelte:head>

{#if data.show}
  <div class="main">
    <div class="header">
      <a href="/admin/emissions" class="not-a">
        <button class="secondary"><i class="fa-solid fa-caret-left" /></button>
      </a>
      <div class="block">
        <h3>Statut</h3>
        <h2>{data.show.status === 0 ? 'En direct' : data.show.status === -1 ? 'En attente' : 'Terminé'}</h2>
      </div>
      <div class="block">
        <h3>Scène</h3>
        <h2>{currentScene}</h2>
      </div>
    </div>
    <div class="manager">
      <div class="prompter-settings">
        <h4 style="margin: 30px auto 25px 40px">Paramètres du prompteur</h4>
        <div class="top-settings">
          <label for="size">
            Taille :&nbsp;&nbsp;<input
              type="number"
              id="size"
              min="32"
              max="128"
              bind:value={fontSize}
              on:change={updatePrompterSettings}
            />
          </label>
          <label for="speed">
            Vitesse :&nbsp;&nbsp;<input
              type="number"
              id="speed"
              min="25"
              max="75"
              bind:value={speed}
              on:change={updatePrompterSettings}
            />
          </label>
          <button
            class="secondary"
            on:click={() => {
              reverse = !reverse
              updatePrompterSettings()
            }}>Renverser</button
          >
        </div>
        <div class="main-settings">
          <table>
            <tr>
              <th>Mode auto</th>
              <th style="padding-right: 30px; border-right: 1px solid #505050">Mode manuel</th>
              <th style="padding-left: 30px">Défilement</th>
            </tr>
            <tr>
              <td>
                <button
                  class="secondary mode"
                  class:toggle-off={mode !== 0}
                  on:click={() => {
                    mode = 0
                    updatePrompterSettings()
                  }}
                >
                  <i class="fa-solid fa-arrows-rotate" />
                </button>
              </td>
              <td style="padding-right: 30px; border-right: 1px solid #505050">
                <button
                  class="secondary mode"
                  class:toggle-off={mode === 0}
                  on:click={() => {
                    mode = mode !== 2 ? 2 : 1
                    updatePrompterSettings()
                  }}
                >
                  <i class="fa-solid" class:fa-pause={mode !== 2} class:fa-play={mode === 2} />
                </button>
              </td>
              <td style="padding-left: 30px">
                <button
                  class="secondary scroll"
                  disabled={mode === 0}
                  on:click={() => {
                    addPrompt = -1
                    updatePrompterSettings()
                  }}><i class="fa-solid fa-angles-up" /></button
                >
                <button
                  class="secondary scroll"
                  on:click={() => {
                    addLine = -1
                    updatePrompterSettings()
                  }}><i class="fa-solid fa-angle-up" /></button
                ><br />
                <button
                  class="secondary scroll"
                  disabled={mode === 0}
                  on:click={() => {
                    addPrompt = 1
                    updatePrompterSettings()
                  }}><i class="fa-solid fa-angles-down" /></button
                >
                <button
                  class="secondary scroll"
                  on:click={() => {
                    addLine = 1
                    updatePrompterSettings()
                  }}><i class="fa-solid fa-angle-down" /></button
                >
              </td>
            </tr>
          </table>
        </div>
        <div class="messages">
          <h4>Messages avec la régie</h4>
          <div class="inner">
            {#each messages as message}
              <p><b>{message.type === 'p' ? 'Vous' : 'Régie'}</b> – {message.message}</p>
            {/each}
          </div>
          <form on:submit|preventDefault={sendMessage}>
            <input type="text" placeholder="Envoyer un message à la régie" bind:value={inputValue} />
          </form>
        </div>
      </div>
      <div class="questions">
        <h4 style="margin-left: 60px; margin-bottom: 30px">Questions</h4>
        <div class="inner">
          {#each data.questions as question}
            <div class="question">
              <button class="secondary" on:click={() => deleteQuestion(question.id || 0)}>
                <i class="fa-solid fa-trash" />
              </button>
              <p class="info">
                {new Date(+question.date * 1000).getHours().toString().padStart(2, '0')}:{new Date(+question.date * 1000)
                  .getMinutes()
                  .toString()
                  .padStart(2, '0')}
              </p>
              <p class="question-text">{question.question}</p>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="main">
    <div class="header">
      <a href="/admin/emissions" class="not-a">
        <button class="secondary"><i class="fa-solid fa-caret-left" /></button>
      </a>
      <h2>Aucun direct en cours</h2>
    </div>
  </div>
{/if}

<style lang="scss">
  div.main {
    background: black;
    min-height: 100vh;
  }

  div.header {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 50px;
    border-bottom: 2px solid white;
  }

  button.secondary {
    width: auto;
    margin: 0;
    background: #151515;
    color: white;
    font-size: 22px;
    padding: 20px 20px;
    border-radius: 0;

    &:hover {
      background: #202020;

      &:active {
        background: #303030;
      }
    }

    &.toggle-off {
      background: #0a0a0a;
      color: #d0d0d0 !important;
    }

    &:disabled {
      background: #0a0a0a !important;
      color: #d0d0d0 !important;
      cursor: not-allowed;
    }
  }

  h2 {
    color: white;
    margin: 0;
    font-size: 22px;
    font-family: Arial, Helvetica, sans-serif !important;
  }

  h3 {
    color: #dedede;
    margin: 0 0 5px 0;
    font-size: 16px;
    font-family: Arial, Helvetica, sans-serif !important;
  }

  h4 {
    color: white;
    margin: 0 0 10px 0;
    font-size: 18px;
    font-family: Arial, Helvetica, sans-serif !important;
  }

  div.manager {
    padding: 0;
    position: relative;
    height: calc(100vh - 70px);
    overflow: hidden;
    font-family: Arial, Helvetica, sans-serif !important;
    color: white;
    display: flex;
    flex-direction: row;

    div.prompter-settings {
      padding: 0;
      flex: 1.2;
      border-right: 2px solid white;
    }

    div.questions {
      padding-top: 30px;
      flex: 0.8;
      font-family: Arial, Helvetica, sans-serif !important;

      div.inner {
        overflow-y: scroll;
        padding: 0 40px;
        height: calc(100vh - 150px);

        div.question {
          background: #0a0a0a;
          padding: 15px;
          margin-bottom: 15px;

          p.info {
            font-size: 14px;
            color: #707070;
            margin: 0 7px 3px 0;
            font-family: Arial, Helvetica, sans-serif !important;
          }

          p.question-text {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif !important;
          }

          button.secondary {
            font-size: 14px;
            padding: 10px 12px;
            float: right;
          }
        }
      }
    }

    div.top-settings {
      display: flex;
      flex-direction: row;
      gap: 30px;
      align-items: center;
      justify-content: center;
      padding: 0 40px;

      input {
        font-family: Arial, Helvetica, sans-serif !important;
        display: inline-block !important;
        border: none !important;
        border-radius: 0px !important;
        padding: 7px 10px !important;
      }

      input[type='number'] {
        width: 40px;
        min-width: 40px;
        max-width: 40px;
        margin: 0;
        padding: 7px 10px !important;
      }

      button.secondary {
        padding: 7px 10px !important;
        font-size: 14px;
      }
    }

    div.main-settings {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 30px;

      table {
        border-collapse: collapse;
        border: 2px solid white;
        border-radius: 3px;
        overflow: hidden;
        margin-top: 30px;

        th {
          color: white;
          padding: 0 5px;
          font-size: 14px;
          font-family: Arial, Helvetica, sans-serif !important;
        }

        td {
          padding: 10px 5px;
          font-size: 18px;
          font-family: Arial, Helvetica, sans-serif !important;

          button.mode {
            font-size: 36px;
            width: 96px;
            padding: 25px 30px;
          }
        }
      }

      button.mode {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        color: white;
        font-size: 22px;
        border-radius: 0;
      }
    }

    div.messages {
      padding: 30px 0 50px 40px;
      border-top: 2px solid white;
      margin-top: 30px;
      position: relative;
      height: calc(100vh - 390px);

      div.inner {
        padding-right: 40px;
        height: calc(100vh - 519px);
        overflow-y: scroll;

        p {
          font-size: 15px;
          font-family: Arial, Helvetica, sans-serif;
        }
      }

      input[type='text'] {
        position: fixed;
        display: block;
        bottom: 0;
        left: 0;
        width: calc(60% - 31px) !important;
        min-width: calc(60% - 31px);
        max-width: calc(60% - 31px);
        height: 30px;
        margin: 0 !important;
        padding: 10px 15px !important;
        outline: none !important;
        border: none !important;
        border-radius: 0 !important;
        border-top: 1px solid #3a393a !important;
        background-color: black !important;
        color: white;
        font-family: 'Segoe UI', 'Arial', sans-serif;
        font-size: 13px;
      }

      input::placeholder {
        color: #707070;
        font-family: Arial, Helvetica, sans-serif;
      }
    }
  }
</style>
