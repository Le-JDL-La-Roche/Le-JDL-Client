<script lang="ts">
  import ModalTemplate from './ModalTemplate.svelte'
  import { invalidateAll } from '$app/navigation'
  import type { PageData } from '../../routes/(main)/admin/agenda/$types'
  import type { Event as Event_ } from '$models/features/agenda.model'
  import ApiAgendaService from '$services/api/api-agenda.service'
  import MarkdownEditor from '$components/others/MarkdownEditor.svelte'

  export let data: PageData
  export let show: boolean
  export let action: { action: 'add' } | { action: 'edit'; element: Event_ }

  const apiAgenda = new ApiAgendaService()

  $: required = false as boolean
  $: error = '' as string
  $: title = '' as string
  $: content = '' as string
  $: date = '' as string
  $: color = '#000000' as string
  $: thumbnail = undefined as File | string | undefined
  $: eventDate = { date: '', time: '' } as { date: string; time: string }

  $: if (show) {
    update()
  }

  function update() {
    error = ''
    if (action.action === 'add') {
      required = true
      title = ''
      content = ''
      date = ''
      color = ''
      thumbnail = undefined
      eventDate = { date: '', time: '' }
    } else {
      required = false
      title = action.element.title
      content = action.element.content
      date = action.element.date
      color = action.element.color
      thumbnail = action.element.thumbnail
      let d = new Date(+date * 1000).toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' }).split('/')
      eventDate = {
        date: `${d[2]}-${d[1]}-${d[0]}`,
        time: new Date(+date * 1000).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris' })
      }
    }
  }

  $: element = {
    title,
    content,
    date: Date.parse(eventDate.date + ' ' + eventDate.time) / 1000 + '',
    color,
    thumbnail
  } as Event_

  async function submit() {
    let exec = action.action === 'add' ? apiAgenda.postEvent : apiAgenda.putEvent
    ;(await exec(element, action.action === 'edit' ? action.element.id || 0 : 0)).subscribe({
      next: (res) => {
        data.data = res.body.data?.agenda || []
        show = false
      },
      error: (err) => {
        error = err.body.message
      }
    })
    show = false
    invalidateAll()
  }

  function handleThumbnailChange(event: Event) {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
      thumbnail = target.files[0]
    } else {
      thumbnail = undefined
    }
  }
</script>

<ModalTemplate size={'m'} bind:show>
  <form on:submit|preventDefault={submit}>
    {#if action.action === 'add'}
      <h3>Ajouter un évènement</h3>
    {:else}
      <h3>
        Modifier l'évènement <em>{action.element.title}</em>
      </h3>
    {/if}

    <!-- svelte-ignore a11y-autofocus -->
    <input type="text" bind:value={title} placeholder="Titre" {required} autofocus />
    <MarkdownEditor bind:value={content} />
    <label for="date">Date de l'évènement :</label>
    <div class="flex-date">
      <input type="date" id="date" bind:value={eventDate.date} />
      <input type="time" bind:value={eventDate.time} />
    </div>

    <label for="color">Couleur :</label>
    <div class="flex-input">
      <input type="color" id="color" bind:value={color}>
      <button type="button" class="secondary jdl-red" on:click={() => color = '#c31718'}>Rouge</button>
      <button type="button" class="secondary jdl-blue" on:click={() => color = '#161f63'}>Bleu</button>
      <button type="button" class="secondary jdl-black" on:click={() => color = '#000000'}>Noir</button>
    </div>

    <label for="thumbnail">Image :</label>
        <input type="file" accept=".png, .jpg, .jpeg" id="thumbnail" on:change={handleThumbnailChange} {required} />

    <div class="actions">
      <p class="error">{error}</p>
      <button class="primary">{action.action === 'add' ? 'Ajouter' : 'Modifier'}</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @use '../../../static/assets/sass/modal.scss';

  div.flex-input {
    display: flex;
    flex: 1;
    flex-direction: row;
    gap: 15px;
    width: calc(50% - 7.5px);
  }

  div.flex-date {
    display: flex;
    flex: 1;
    flex-direction: row;
    gap: 15px;
    width: calc(50% - 7.5px);
  }

  input[type=color] {
    min-width: 100px;
    height: 30px;
    border-radius: 3px;
    transition: all 0.3s;
    margin-bottom: 20px;
  }

  button.secondary {
    &.jdl-red, &.jdl-blue, &.jdl-black {
      margin-top: 0;
      color: white;
      margin-bottom: 20px;
      
      &:hover:active {
        color: black;
      }
    }


    &.jdl-red {
      background-color: var(--primary-red-color);
    }
    
    &.jdl-blue {
      background-color: var(--blue-color);
    }
    
    &.jdl-black {
      background-color: black;
    }
  }
</style>
