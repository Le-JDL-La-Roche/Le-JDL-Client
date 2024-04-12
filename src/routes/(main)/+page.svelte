<script lang="ts">
  import type { PageData } from './$types'
  import ImportantList from '$components/lists/ImportantList.svelte'
  import List from '$components/lists/List.svelte'
  import HomeAgenda from '$components/others/HomeAgenda.svelte'
  import ContentService from '$services/content.service'
  import { onMount } from 'svelte'

  export let data: PageData

  const content = new ContentService()

  let style: HTMLStyleElement

  onMount(() => {
    if (data.info.find((e) => e.enabled)) {
      style.innerHTML = content.addPrefixToStyle(data.info.find((e) => e.enabled)?.css || '', '.info-isolation')
    }
  })

  let b = 0
  data.agenda.forEach((event) => {
    if (+event.date > Math.round(new Date().getTime() / 1000)) {
      b++
    }
  })
</script>

<svelte:head>
  <title>Le JDL - La Roche</title>

  <meta name="title" content="Le JDL - La Roche" />
  <meta name="twitter:title" content="Le JDL - La Roche" />
  <meta property="og:title" content="Le JDL - La Roche" />

  <meta
    name="description"
    content="Bienvenue sur le site Web du Journal du Lycée La Rochefoucauld ! Vous trouverez sur ce site nos émissions, nos vidéos et nos article."
  />
  <meta
    name="twitter:description"
    content="Bienvenue sur le site Web du Journal du Lycée La Rochefoucauld ! Vous trouverez sur ce site nos émissions, nos vidéos et nos article."
  />
  <meta
    property="og:description"
    content="Bienvenue sur le site Web du Journal du Lycée La Rochefoucauld ! Vous trouverez sur ce site nos émissions, nos vidéos et nos article."
  />
</svelte:head>

{#if data.info.find((e) => e.enabled)}
  <div class="info-isolation">
    {@html content.markdownToHtml((data.info.find((e) => e.enabled) || { html: '' }).html, false)}
    <style bind:this={style}>
    </style>
  </div>
{/if}
<div class="flex">
  <div>
    <h2 style="margin-top: 10px">Bienvenue sur le site du JDL !</h2>
    <p class="desc">
      Bienvenue sur le site Web du Journal du Lycée La Rochefoucauld !<br />Nous sommes heureux de vous retrouver pour une
      troisième année, durant laquelle nous ferons notre maximum pour vous proposer un maximum de contenu. Cette année, au
      programme : émissions de radio, vidéos, articles, et bien plus encore !<br />N'hésitez pas à rejoindre la rédaction ! C'est
      une expérience très enrichissante et formatrice, qui vous permettra de participer à de nouveaux projets.<br />Vous pouvez
      également nous suivre sur les <a href="/bienvenue">réseaux sociaux</a>, et nous contacter par
      <a href="mailto:lejdl@laroche.org">mail</a>.<br />
    </p>
  </div>
  <div class="agenda">
    <h2 style="margin-top: 10px">Agenda <span class:b>{b || ''}</span></h2>
    <HomeAgenda agenda={data.agenda} />
  </div>
</div>

<h2>Nos derniers podcasts radio</h2>
<ImportantList shows={data.shows} />

<h2 style="margin-top: 20px">Nos dernières vidéos</h2>
<ImportantList videos={data.videos} />

<h2 style="margin-top: 20px">Notre dernier article</h2>
<List articles={[data.articles[0]]} />

<h2>La Rédaction</h2>
<div class="editorial-staff">
  {#each data.journalists as journalist}
    <div class="journalist">
      <p class="name">{journalist.name}</p>
      <p class="class">{journalist.class}</p>
    </div>
  {/each}
</div>

<style lang="scss">
  div.editorial-staff {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    gap: 20px;
  }

  div.journalist {
    display: block;
    position: relative;
    flex: 1;
    overflow: hidden;
    padding: 20px;
    border: 1px solid var(--light-gray-color);
    border-radius: 5px;

    p {
      margin: 0;

      &.class {
        color: var(--dark-gray-color);
        margin-top: 0;
        margin-bottom: 0;
      }
    }
  }

  span.b {
    display: inline-block;
    margin-left: 10px;
    font-size: 15px;
    color: white;
    background-color: #f00014;
    border-radius: 50rem;
    height: 15px;
    width: 15px;
    text-align: center;
    padding: 7px;
    line-height: 1;
    position: relative;
    top: -5px;
    font-weight: normal;
    font-family: Helvetica, Arial, sans-serif;
  }

  @media screen and (min-width: 850px) {
    div.flex {
      display: flex;
      flex-direction: row;
      gap: 30px;

      div.agenda {
        min-width: 400px;
      }
    }

    div.editorial-staff {
      flex-direction: row;
    }

    div.journalist {
      flex-basis: calc(25% - 57px);
      flex-grow: 0;
      flex-direction: row;
    }
  }
</style>
