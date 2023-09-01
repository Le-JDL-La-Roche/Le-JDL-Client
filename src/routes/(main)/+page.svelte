<script lang="ts">
  import type { PageData } from './$types'
  import ImportantList from '$components/lists/ImportantList.svelte'
  import List from '$components/lists/List.svelte'
  import HomeAgenda from '$components/others/HomeAgenda.svelte'

  export let data: PageData

  let b = 0
  data.agenda.forEach((event) => {
    if (+event.date > Math.round(new Date().getTime() / 1000)) {
      b++
    }
  })
</script>

<svelte:head>
  <title>Le JDL - La Roche</title>
</svelte:head>

<div class="flex">
  <div>
    <h2>Bienvenue sur le site du JDL !</h2>
    <p class="desc">
      Bienvenue sur le site du Journal du Lycée La Rochefoucauld !<br />Nous sommes heureux de vous retrouver pour une troisième
      année, durant laquelle nous ferons notre maximum pour vous proposer un maximum de contenu. Cette année, au programme :
      émissions de radio, vidéos, articles, et bien plus encore !<br />N'hésitez pas à rejoindre la rédaction ! C'est une
      expérience très enrichissante et formatrice, qui vous permettra de participer à de nouveaux projets.<br />Vous pouvez
      également nous suivre sur les <a href="/bienvenue">réseaux sociaux</a>, et nous contacter par
      <a href="mailto:lejdl@laroche.org">mail</a>.<br />
    </p>
  </div>
  <div class="agenda">
    <h2>Agenda <span class:b>{b || ''}</span></h2>
    <HomeAgenda agenda={data.agenda} />
  </div>
</div>

<h2>Nos derniers podcasts radio</h2>
<ImportantList shows={data.shows} />

<h2>Nos dernières vidéos</h2>
<ImportantList videos={data.videos} />

<h2>Notre dernier article</h2>
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
