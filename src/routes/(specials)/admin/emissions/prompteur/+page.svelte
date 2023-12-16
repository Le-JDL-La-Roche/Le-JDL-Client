<script lang="ts">
  import { goto } from '$app/navigation'
  import type { PageData } from './$types'
  import ApiWebradioService from '$services/api/api-webradio.service'
  import io from '$services/api/socket.service'

  import utils from '$services/utils'
  import { onMount } from 'svelte'
  import type { WebradioShow } from '$models/features/webradio-show.model'

  export let data: PageData

  const apiWebradio = new ApiWebradioService()

  onMount(() => window.scrollTo(0, document.body.scrollHeight))

  async function deleteQuestion(id: number) {
    ;(await apiWebradio.deleteQuestion(id)).subscribe({
      next: (res) => {
        data.questions = res.body.data?.questions || []
        io.emit('question')
      }
    })
  }

  io.on('waitStreamLaunched', (show: WebradioShow) => {
    data.show = show
  })

  io.on('liveStreamLaunched', (show: WebradioShow) => {
    data.show = show
  })

  io.on('liveStreamStopped', (show: WebradioShow) => {
    if (data.show) data.show.status = 1
  })

  io.on('updateQuestions', async (questions: any) => {
    data.questions = questions
    await utils.sleep(50)
    window.scrollTo(0, document.body.scrollHeight)
  })
</script>

<svelte:head>
  <title>Prompteur • Le JDL - La Roche</title>
</svelte:head>

{#if data.show}
  <!-- <div class="main">
    <div class="header">
      <div class="content">
        <h2>
          <a href="/admin/emissions" class="not-a">
            <button class="secondary">
              <i class="fa-solid fa-caret-left" />&nbsp;&nbsp;Retour
            </button>
          </a>
          Questions en direct
        </h2>
        <h1>{data.show.title}</h1>
      </div>
    </div>
    <div class="content" style="padding-top: 30px; padding-bottom: 30px">
      {#each data.questions as question}
        <div class="question">
          <div class="left">
            <p class="info">
              {new Date(+question.date * 1000).getHours().toString().padStart(2, '0')}:{new Date(+question.date * 1000)
                .getMinutes()
                .toString()
                .padStart(2, '0')}
            </p>
            <p class="question-text">{question.question}</p>
          </div>
          <div class="actions">
            <button class="secondary" on:click={() => deleteQuestion(question.id || 0)}><i class="fa-solid fa-trash" /></button>
          </div>
        </div>
      {/each}
    </div>
  </div> -->
  <div class="main">
    <div class="header">
      <a href="/admin/emissions" class="not-a">
        <button class="secondary"><i class="fa-solid fa-caret-left" /></button>
      </a>
      <div class="block">
        <h3>Status</h3>
        <h2>{data.show.status === 0 ? 'En direct' : data.show.status === -1 ? 'En attente' : 'Terminé'}</h2>
      </div>
      <div class="block">
        <h3>Scène</h3>
        <h2>...</h2>
      </div>
    </div>
    <div class="prompter">
      <i class="fa-solid fa-chevron-right mark" />
      <p class="prompt">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis repellat culpa cum eveniet exercitationem eius provident
        asperiores, quae architecto, sed non debitis odit veniam sit est explicabo minus? Beatae, ipsa.
      </p>
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
    gap: 70px;
    border-bottom: 2px solid white;
  }

  button.secondary {
    width: auto;
    margin: 0;
    background: black;
    color: white;
    font-size: 36px;
    padding: 30px 30px;
    border-radius: 0;

    &:hover {
      background: #151515;

      &:active {
        background: #202020;
      }
    }
  }

  h2 {
    color: white;
    margin: 0;
    font-size: 36px;
    font-family: Arial, Helvetica, sans-serif !important;
  }

  h3 {
    color: white;
    margin: 0 0 5px 0;
    font-size: 24px;
    font-family: Arial, Helvetica, sans-serif !important;
  }

  div.prompter {
    padding: 0 70px 0 90px;
    position: relative;
    height: calc(100vh - 105px);
    overflow: hidden;

    i.mark {
      position: absolute;
      left: 25px;
      font-size: 50px;
      top: calc(50% - 20px);
      color: #70ff70;
    }
  }

  p.prompt {
    font-size: 62px;
    color: white;
    font-family: Arial, Helvetica, sans-serif !important;
    margin: 0;
    line-height: 2;
    word-spacing: 5px;
  }

  p.info {
    font-size: 14px;
    color: var(--dark-gray-color);
    margin: 0 7px 3px 0;
  }

  p.question-text {
    margin: 0;
  }

  @media screen and (min-width: 850px) {
    div.question {
      flex-direction: row;
    }

    div.left {
      flex: 1;
    }

    div.actions {
      text-align: right;
      flex-direction: column;
    }
  }
</style>
