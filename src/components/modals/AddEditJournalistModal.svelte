<script lang="ts">
  import ModalTemplate from './ModalTemplate.svelte'
  import CookiesService from '$services/cookies.service'
  import { invalidateAll } from '$app/navigation'
  import type { PageData } from '../../routes/(main)/admin/journalistes/$types'
  import type { Journalist } from '$models/data/journalist.model'
  import ApiEnvService from '$services/api/api-env.service'

  export let data: PageData
  export let show: boolean
  export let action: { action: 'add' } | { action: 'edit'; element: Journalist }

  const apiEnv = new ApiEnvService()

  $: required = false as boolean
  $: error = '' as string
  $: fName = '' as string
  $: lName = '' as string
  $: classLvl = '' as 'Troisième' | 'Seconde' | 'Première' | 'Terminale' | ''
  $: className = '' as 'A' | 'B' | 'C' | 'D' | ''

  $: if (show) {
    update()
  }

  function update() {
    error = ''
    if (action.action === 'add') {
      required = true
      fName = ''
      lName = ''
      classLvl = ''
      className = ''
    } else {
      required = false
      fName = action.element.name.split(' ')[0]
      lName = action.element.name.split(' ')[1]
      classLvl = action.element.class.split(' ')[0] as 'Troisième' | 'Seconde' | 'Première' | 'Terminale'
      className = action.element.class.split(' ')[1] as 'A' | 'B' | 'C' | 'D'
    }
  }

  $: element = {
    name: `${fName} ${lName}`,
    class: `${classLvl} ${className}`
  } as Journalist

  async function submit() {
    let exec = action.action === 'add' ? apiEnv.postJournalist : apiEnv.putJournalist
    ;(await exec(element, action.action === 'edit' ? action.element.id || 0 : 0)).subscribe({
      next: (res) => {
        data.data = res.body.data?.journalists || []
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

<ModalTemplate size={'m'} bind:show>
  <form on:submit|preventDefault={submit}>
    {#if action.action === 'add'}
      <h3>Ajouter un journaliste</h3>
    {:else}
      <h3>
        Modifier les information de
        <em>{action.element.name}</em>
      </h3>
    {/if}

    <div class="flex-input">
      <!-- svelte-ignore a11y-autofocus -->
      <input type="text" bind:value={fName} placeholder="Prénom" {required} autofocus />
      <input type="text" bind:value={lName} placeholder="Nom" {required} />
    </div>
    
    <div class="flex-input">
      <select bind:value={classLvl}>
        <option value={''} selected disabled>-- Niveau --</option>
        <option value={'Troisième'}>Troisième</option>
        <option value={'Seconde'}>Seconde</option>
        <option value={'Première'}>Première</option>
        <option value={'Terminale'}>Terminale</option>
      </select>
      <select bind:value={className}>
        <option value={''} selected disabled>-- Nom de classe --</option>
        <option value={'A'}>A</option>
        <option value={'B'}>B</option>
        <option value={'C'}>C</option>
        <option value={'D'}>D</option>
      </select>
    </div>

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
</style>
