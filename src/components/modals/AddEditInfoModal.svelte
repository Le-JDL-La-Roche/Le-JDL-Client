<script lang="ts">
  import ModalTemplate from './ModalTemplate.svelte'
  import { invalidateAll } from '$app/navigation'
  import type { PageData } from '../../routes/(main)/admin/infos/$types'
  import MarkdownEditor from '$components/others/MarkdownEditor.svelte'
  import type { Info } from '$models/features/info.model'
  import ApiInfoService from '$services/api/api-info.service'
  import { onMount } from 'svelte'
  import ContentService from '$services/content.service'

  export let data: PageData
  export let show: boolean
  export let action: { action: 'add' } | { action: 'edit'; element: Info }

  const apiInfo = new ApiInfoService()
  const content = new ContentService()

  let style: HTMLStyleElement

  $: required = false as boolean
  $: error = '' as string
  $: html = '' as string
  $: css = '' as string
  $: enabled = false as boolean

  $: if (show) {
    update()
  }

  function update() {
    error = ''
    if (action.action === 'add') {
      required = true
      html = '<Contenu HTML & Markdown ; utiliser la balise br pour aller à la ligne>'
      css = '<Style CSS>'
      enabled = false
    } else {
      required = false
      html = action.element.html
      css = action.element.css
      enabled = action.element.enabled
    }
  }

  $: element = {
    html,
    css,
    enabled
  } as Info

  $: if (element.css && style) {
    element.css = element.css.replace(/ /g, ' ')
    style.innerHTML = content.addPrefixToStyle(element.css, '.info-preview-isolation')
  }

  $: if (element.html) {
    element.html = element.html.replace(/ /g, ' ')
  }

  async function submit() {
    let exec = action.action === 'add' ? apiInfo.postInfo : apiInfo.putInfo
    ;(await exec(element, action.action === 'edit' ? action.element.id || 0 : 0)).subscribe({
      next: (res) => {
        data.data = res.body.data?.info || []
        show = false
      },
      error: (err) => {
        error = err.body.message
      }
    })
    show = false
    invalidateAll()
  }
</script>

<ModalTemplate size={'l'} bind:show>
  <form on:submit|preventDefault={submit}>
    {#if action.action === 'add'}
      <h3>Ajouter une information</h3>
    {:else}
      <h3>Modifier l'information</h3>
    {/if}

    <div class="add-modal">
      <div class="add">
        <MarkdownEditor bind:value={html} lite={1} code={true} />
        <MarkdownEditor bind:value={css} lite={3} code={true} />
        <small style="position: relative; top: -20px">
          <i><b>Attention </b> à la compatibilité ordinateur/téléphone !</i>
        </small>
      </div>

      <div class="preview info-preview-isolation">
        {@html content.markdownToHtml(element.html, false)}
        <style bind:this={style}>
        </style>
      </div>
    </div>

    <div class="actions">
      <p class="error">{error}</p>
      <button class="primary">{action.action === 'add' ? 'Ajouter' : 'Modifier'}</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @use '../../../static/assets/sass/modal.scss';

  div.add-modal {
    display: flex;
    flex-direction: column;
    gap: 30px;

    &:before {
      content: '';
      border-left: 1px solid var(--light-gray-color);
      align-self: stretch;
    }
  }

  div.add {
    order: -1;
  }

  @media screen and (min-width: 850px) {
    div.add-modal {
      flex-direction: row;

      div.add {
        flex: 1 1 50%;
      }

      div.preview {
        flex: 1 1 50%;
      }
    }
  }
</style>
