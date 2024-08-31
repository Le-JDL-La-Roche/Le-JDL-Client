<script lang="ts">
  import AuthorizeElementModal from '$components/modals/AuthorizeElementModal.svelte'
  import type { Authorization } from '$models/data/authorization.model'
  import type { PageData } from '../../routes/(main)/verif/$types'

  export let data: PageData
  export let i: number
  export let authorizationId: number | null

  let showAuthorizeElementModal = false

  $: authorization = {
    ...data.data.authorizations[i],
    content: JSON.parse(data.data.authorizations[i].content as string)
  } as Authorization
  $: element =
    authorization.elementType === 'show'
      ? data.data.shows.find((show) => show.id === authorization.elementId)
      : authorization.elementType === 'video'
      ? data.data.videos.find((video) => video.id === authorization.elementId)
      : data.data.articles.find((article) => article.id === authorization.elementId)
  $: type =
    authorization.elementType === 'show'
      ? 'emissions'
      : authorization.elementType === 'video'
      ? 'videos'
      : ('articles' as 'emissions' | 'videos' | 'articles')
  $: legacy = JSON.parse(data.data.authorizations[i].content as string)?.title ? true : false

  $: if (authorization) {
    update()
  }

  function update() {
    showAuthorizeElementModal = authorization.id === authorizationId ? true : false
  }
</script>

{#if element}
  {#if legacy}
    <div title="Autorisation incompatible avec le système d'autorisation numériques" class="legacy">
      <p class="type">{'streamId' in element ? 'Émission' : 'type' in element ? 'Vidéo' : 'Article'}</p>
      <p>{element.title}</p>
    </div>
  {:else}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      on:click={() => (showAuthorizeElementModal = true)}
      class:waiting={authorization.status === -1}
      class:refused={authorization.status === 1}
      class:approved={authorization.status === 2}
    >
      <p class="type">{'streamId' in element ? 'Émission' : 'type' in element ? 'Vidéo' : 'Article'}</p>
      <p>{element.title}</p>
    </div>
  {/if}

  <AuthorizeElementModal
    bind:data
    bind:authorization
    bind:element
    bind:type
    bind:show={showAuthorizeElementModal}
    {authorizationId}
  />
{/if}

<style lang="scss">
  div {
    padding: 15px 20px;
    border-radius: 5px;
    margin-bottom: 20px;
    font-size: 17px;
    cursor: pointer;

    &.waiting {
      background-color: #faf0d2;
      color: #252317;
    }

    &.refused {
      background-color: #f8d7d7;
      color: #241717;
      opacity: 0.8;
    }

    &.approved {
      background-color: #d7f8d7;
      color: #162416;
      opacity: 0.8;
    }

    &.legacy {
      background-color: #fdfdfd;
      color: #a0a0a0;
      cursor: default;

      .type {
        color: #8f8f8f;
      }
    }
  }

  p {
    margin: 0;

    &.type {
      font-size: 14px;
      color: #747474;
    }
  }
</style>
