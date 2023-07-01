<script lang="ts">
  /**
   * Made with the help of GitHub Copilot
   */
  import { onMount } from 'svelte'

  export let value: string

  let editor: HTMLDivElement
  let selection: Selection,
    range: Range,
    textNode: Node,
    text: string,
    startOffset: number,
    endOffset: number,
    formattedText: string | null,
    startNode: Node,
    inText: string,
    beforeText: string,
    mdLength: number

  function shrotcutFormat(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
      event.preventDefault()
      format('**')
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
      event.preventDefault()
      format('*')
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'u') {
      event.preventDefault()
      format('__')
    }
  }

  async function handlePaste(event: ClipboardEvent) {
    event.preventDefault()
    const text = event.clipboardData?.getData('text/plain')
    if (text) {
      document.execCommand('insertText', false, text)
    }
  }

  function preview() {
    value = editor.innerText
  }

  function format(md: string) {
    updateSelection(md)
    if (text.startsWith(md) && text.endsWith(md)) {
      if (md === '*') {
        if ((text.startsWith('***') && text.endsWith('***')) || !text.startsWith('**') || !text.endsWith('**')) {
          unformatFull()
        } else {
          endFormat(md)
        }
      } else {
        unformatFull()
      }
    } else if (getChars(mdLength).prevChars === md && getChars(mdLength).nextChars === md) {
      if (md === '*') {
        if (
          (getChars(3).prevChars === '***' && getChars(3).nextChars === '***') ||
          getChars(2).prevChars !== '**' ||
          getChars(2).nextChars !== '**'
        ) {
          unformat()
        } else {
          endFormat(md)
        }
      } else {
        unformat()
      }
    } else {
      endFormat(md)
    }
    selection.removeAllRanges()
    selection.addRange(range)
  }

  function endFormat(md: string) {
    formattedText = `${md}${text}${md}`
    if (execFormat()) {
      range.setStart(textNode, startOffset + mdLength)
      range.setEnd(textNode, endOffset + mdLength)
    }
  }

  function globalFormat(md: string, around: boolean = false, reverse: string | null = null) {
    updateSelection(md)
    const lineStart = beforeText.lastIndexOf('\n') + 1
    const char = document.createTextNode(md + '\xa0')
    let add
    if (!around) {
      if (textNode.textContent && textNode.textContent.startsWith(md + '\xa0')) {
        formattedText = textNode.textContent.substring(mdLength + 1)
        add = false
      } else {
        formattedText = `${md}\xa0${inText}`
        add = true
      }
    } else {
      if (
        textNode.textContent &&
        textNode.textContent.startsWith(md + '\xa0') &&
        textNode.textContent.endsWith('\xa0' + (reverse || md))
      ) {
        formattedText = textNode.textContent.substring(mdLength + 1)
        formattedText = formattedText.substring(0, formattedText.length - mdLength - 1)
        add = false
      } else {
        formattedText = `${md}\xa0${inText}\xa0${reverse || md}`
        add = true
      }
    }
    if (execGlobalFormat()) {
      const offset = add ? mdLength + 1 : -mdLength - 1
      range.setStart(textNode, startOffset + offset)
      range.setEnd(textNode, endOffset + offset)
    }
    selection.removeAllRanges()
    selection.addRange(range)
  }

  function insert(type: 'link' | 'link_' | 'image' | 'youtube') {
    updateSelection('')
    let sf = 0
    let t = ''

    switch (type) {
      case 'link':
        t = text || 'texte'
        sf = 1
        formattedText = `[${t}](url)`
        break
      case 'link_':
        t = text || 'texte'
        sf = 1
        formattedText = `[${t}]_(url)`
        break
      case 'image':
        t = text || 'légende'
        sf = 2
        formattedText = `![${t}][source](url)`
        break
      case 'youtube':
        t = 'videoId'
        sf = 2
        formattedText = `!(${t})`
        break
      default:
        formattedText = ''
        break
    }

    if (execFormat()) {
      range.setStart(textNode, startOffset + sf)
      range.setEnd(textNode, startOffset + sf + t.length)
    }
    selection.removeAllRanges()
    selection.addRange(range)
  }

  function updateSelection(md: string) {
    selection = window.getSelection()!
    range = selection.getRangeAt(0)
    textNode = range.startContainer
    text = range.toString()
    startOffset = range.startOffset
    endOffset = range.endOffset
    formattedText = null
    startNode = range.startContainer
    inText = startNode.textContent || ''
    beforeText = inText.substring(0, startOffset)
    mdLength = md.length
  }

  function getChars(n: number = 1) {
    var rawContent = editor.textContent + ''
    var startIndex = rawContent.indexOf((range.startContainer.textContent + '').trimEnd()) + range.startOffset
    var leadingCharacters = rawContent.slice(0, startIndex).split('').reverse()
    var trailingCharacters = rawContent.slice(startIndex + text.length, rawContent.length).split('')
    let prevChars = leadingCharacters.slice(0, n).join('') || ''
    let nextChars = trailingCharacters.slice(0, n).join('') || ''
    return { prevChars, nextChars }
  }

  function execFormat() {
    if (editor.contains(range.startContainer) && editor.contains(range.endContainer)) {
      const formattedNode = document.createTextNode(formattedText + '')
      range.deleteContents()
      range.insertNode(formattedNode)
      range.setStartBefore(formattedNode)
      range.setEndAfter(formattedNode)
      editor.normalize()
      range = selection.getRangeAt(0)
      textNode = range.startContainer
      if (textNode.nodeName !== '#text' && textNode.firstChild) {
        textNode = textNode.firstChild
      }
      preview()
      return true
    } else {
      return false
    }
  }

  function execGlobalFormat() {
    if (editor.contains(range.startContainer) && editor.contains(range.endContainer)) {
      const formattedNode = document.createTextNode(formattedText + '')
      textNode.textContent = formattedNode.textContent
      editor.normalize()
      range = selection.getRangeAt(0)
      textNode = range.startContainer
      if (textNode.nodeName !== '#text' && textNode.firstChild) {
        textNode = textNode.firstChild
      }
      preview()
      return true
    } else {
      return false
    }
  }

  function unformat() {
    if (editor.contains(range.startContainer) && editor.contains(range.endContainer)) {
      const textNode_: any = textNode
      textNode_.deleteData(startOffset - mdLength, mdLength)
      textNode_.deleteData(endOffset - mdLength, mdLength)
      preview()
    }
  }

  function unformatFull() {
    if (editor.contains(range.startContainer) && editor.contains(range.endContainer)) {
      formattedText = text.slice(mdLength, -mdLength)
      execFormat()
      preview()
    }
    editor.normalize()
  }

  onMount(() => {
    editor.innerText = value
  })
</script>

<div class="container">
  <div class="buttons">
    <div class="section">
      <button
        class="secondary"
        type="button"
        title="Chapô"
        on:click={() => globalFormat('###', true)}
        style="border-top-left-radius: 5px"
      >
        <i class="fa-solid fa-grip-lines" />
      </button>
    </div>

    <div class="section">
      <button class="secondary" type="button" title="Titre de partie" on:click={() => globalFormat('#')}>
        <i class="fa-solid fa-a" />
      </button>
    </div>

    <div class="section">
      <button class="secondary" type="button" title="Gras" on:click={() => format('**')}>
        <i class="fa-solid fa-bold" />
      </button>
      <button class="secondary" type="button" title="Italique" on:click={() => format('*')}>
        <i class="fa-solid fa-italic" />
      </button>
      <button class="secondary" type="button" title="Souligné" on:click={() => format('__')}>
        <i class="fa-solid fa-underline" />
      </button>
      <button class="secondary" type="button" title="Barré" on:click={() => format('~~')}>
        <i class="fa-solid fa-strikethrough" />
      </button>
    </div>

    <div class="section">
      <button class="secondary" type="button" title="Lien" on:click={() => insert('link')}>
        <i class="fa-solid fa-link" />
      </button>
      <button class="secondary" type="button" title="Lien externe" on:click={() => insert('link_')}>
        <i class="fa-solid fa-arrow-up-right-from-square" />
      </button>
      <button class="secondary" type="button" title="Citation" on:click={() => globalFormat('>', true, '<')}>
        <i class="fa-solid fa-quote-left" />
      </button>
      <button class="secondary" type="button" title="Image" on:click={() => insert('image')}>
        <i class="fa-solid fa-image" />
      </button>
      <button class="secondary" type="button" title="Vidéo YouTube" on:click={() => insert('youtube')}>
        <i class="fa-brands fa-youtube" />
      </button>
    </div>
  </div>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="editor"
    contenteditable="true"
    on:change={preview}
    on:keyup={preview}
    bind:this={editor}
    on:keyup={shrotcutFormat}
    on:paste={handlePaste}
  />
</div>

<style lang="scss">
  div.buttons {
    display: block;
    border-radius: 5px 5px 0 0;
    background-color: var(--mid-gray-color);

    div.section {
      display: flex;
    }

    button {
      display: inline-block;
      width: 31px;
      border-radius: 0;
      margin-top: 0;
      height: 35px;
      width: 35px;
    }
  }

  div.editor {
    border-radius: 0 0 5px 5px;
  }

  @media screen and (min-width: 850px) {
    div.buttons {
      display: flex;
      border-radius: 5px 5px 0 0;
      background-color: var(--mid-gray-color);
      gap: 15px;
    }
  }
</style>
