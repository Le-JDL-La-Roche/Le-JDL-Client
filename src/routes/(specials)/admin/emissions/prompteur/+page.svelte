<script lang="ts">
  import { goto } from '$app/navigation'
  import type { PageData } from './$types'
  import ApiWebradioService from '$services/api/api-webradio.service'
  import io from '$services/api/socket.service'
  import utils from '$services/utils'
  import { onMount } from 'svelte'

  export let data: PageData

  const apiWebradio = new ApiWebradioService()

  onMount(() => window.scrollTo(0, document.body.scrollHeight))

  if (!data.show) {
    goto('/admin/emissions')
  }

  async function deleteQuestion(id: number) {
    ;(await apiWebradio.deleteQuestion(id)).subscribe({
      next: (res) => {
        data.questions = res.body.data?.questions || []
        io.emit('question')
      }
    })
  }

  io.on('updateQuestions', async (questions: any) => {
    data.questions = questions
    await utils.sleep(50)
    window.scrollTo(0, document.body.scrollHeight)
  })
</script>

<svelte:head>
  <title>Questions en direct • Le JDL - La Roche</title>
</svelte:head>

{#if data.show}
  <div class="main">
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
  </div>
{/if}

<style lang="scss">
  div.main {
    background: linear-gradient(137deg, #606c88, #191654);
    min-height: 100vh;
  }

  div.header {
    background: linear-gradient(137deg, #606c88, #191654);
    background-size: 100vw 100vh;
    padding: 12.5px 0 0.05px 0;
    box-shadow: 0 0 10px #00000030;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  button.secondary {
    width: auto;
    margin: 0 0 7px 0;
  }

  h1 {
    color: white;
    margin-bottom: 15px;
    margin-top: 0;
  }

  h2 {
    color: white;
    margin: 7px 0;
    display: flex;
    flex-direction: row;
    gap: 30px;
    align-items: center;
  }

  div.question {
    position: relative;
    flex: 1;
    overflow: hidden;
    margin-bottom: 20px;
    padding: 30px;
    border: 1px solid var(--light-gray-color);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    background-color: white;

    div.left {
      flex: 1;
    }

    div.actions {
      display: flex;
      flex-direction: row;
      gap: 15px;

      button.secondary {
        height: 31px;
        margin-top: 0;
      }
    }
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
    div.header {
      padding: 20px 0;
    }

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
