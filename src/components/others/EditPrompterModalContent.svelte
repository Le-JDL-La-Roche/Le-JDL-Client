<script lang="ts">
  import MarkdownEditor from './MarkdownEditor.svelte'
  import utils from '$services/utils'

  export let showPrompterModal: boolean
  export let prompter: { title: string; content: string }[] = [
    { title: 'Introduction', content: '' },
    { title: '', content: '' },
    { title: 'Conclusion', content: '' }
  ]

  $: p2 = prompter.slice(1, prompter.length - 1)

  async function showAddButton(id: number) {
    const addButton = document.getElementById(`add-button-${id}`) as HTMLButtonElement
    await utils.sleep(400)
    addButton.classList.add('show-add-button')
  }

  async function hideAddButton(id: number) {
    const addButton = document.getElementById(`add-button-${id}`) as HTMLButtonElement
    await utils.sleep(400)
    addButton.classList.remove('show-add-button')
  }
</script>

<div class="add-modal">
  <div class="add">
    <div class="prompter-header">
      <button type="button" class="secondary" on:click={() => (showPrompterModal = false)}>
        <i class="fa-solid fa-caret-left" />
      </button>
      <p class="section-title"><strong>Modifier le prompteur</strong></p>
    </div>

    <div class="prompt" style="margin-top: 5px">
      <p>{prompter[0].title}</p>
      <MarkdownEditor bind:value={prompter[0].content} lite={2} />
    </div>

    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <div class="add" on:mouseover={() => showAddButton(0)} on:mouseleave={() => hideAddButton(0)}>
      <button
        type="button"
        class="secondary add"
        id="add-button-0"
        on:click={() => {
          prompter.splice(1, 0, { title: '', content: '' })
          p2 = prompter.slice(1, prompter.length - 1)
        }}
      >
        <i class="fa-solid fa-plus" />
      </button>
    </div>

    {#each p2 as prompt, i}
      <div class="prompt">
        <button
          type="button"
          class="secondary delete"
          on:click={() => {
            prompter.splice(i + 1, 1)
            p2 = prompter.slice(1, prompter.length - 1)
          }}
        >
          <i class="fa-solid fa-trash" />
        </button>
        <input type="text" placeholder="Titre" bind:value={prompt.title} class="prompt-title" />
        <MarkdownEditor bind:value={prompt.content} lite={2} />
      </div>

      {#if i < prompter.length - 2}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <div class="add" on:mouseover={() => showAddButton(i + 1)} on:mouseleave={() => hideAddButton(i + 1)}>
          <button
            type="button"
            class="secondary add"
            id={`add-button-${i + 1}`}
            on:click={() => {
              prompter.splice(i + 2, 0, { title: '', content: '' })
              p2 = prompter.slice(1, prompter.length - 1)
            }}
          >
            <i class="fa-solid fa-plus" />
          </button>
        </div>
      {/if}
    {/each}

    <div class="prompt">
      <p>{prompter[prompter.length - 1].title}</p>
      <MarkdownEditor bind:value={prompter[prompter.length - 1].content} lite={2} />
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../../static/assets/sass/modal.scss';

  p.section-title {
    margin-top: 0;
  }

  div.prompter-header {
    display: flex;
    flex-direction: row;
    gap: 15px;
    align-items: center;

    button.secondary {
      width: 35px;
      margin: 0 0 15px 0;
    }
  }

  div.prompt {
    margin: 0;
    padding: 20px 20px 0 20px;
    position: relative;
    border: 1px solid #f0f0f0;
    border-radius: 5px;
    background: #fdfdfd;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);

    p {
      margin-top: 0;
    }
  }

  input.prompt-title {
    width: calc(100% - 70px) !important;
    min-width: calc(100% - 70px) !important;
    max-width: calc(100% - 70px) !important;
    margin: 0 0 15px 0;
  }

  button.add {
    margin: 15px calc(50% - 20px);
    width: 40px;
    height: 0;
    padding: 0 10px;
    opacity: 0;
    overflow: hidden;
    transition: all 0.4s ease-in-out;
  }

  button.delete {
    width: 35px;
    height: 39px;
    margin-top: 0;
    float: right;
  }
</style>
