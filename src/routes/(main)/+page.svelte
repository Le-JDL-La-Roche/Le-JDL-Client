<script lang="ts">
  import type { PageData } from './$types'
  import ImportantList from '$components/lists/ImportantList.svelte'
  import List from '$components/lists/List.svelte'

  export let data: PageData
</script>

<svelte:head>
  <title>Le JDL - La Roche</title>
</svelte:head>

<h2>Bienvenue sur le Blog du JDL !</h2>
<div class="flex">
  <p class="desc">
    Bienvenue sur le blog du Journal du Lycée La Rochefoucauld !<br />Nous somme heureux de vous retrouver pour une troisième
    année, durant laquelle nous ferons notre maximum pour vous proposer un maximum de contenu. Cette année, au programme :
    émissions de radio, vidéos, articles, et bien plus encore !<br />N'hésitez pas à rejoindre la rédaction ! C'est une expérience
    très enrichissante et formatrice, qui vous permettra de participer à de nouveau projets.<br />Vous pouvez également nous
    suivre sur les <a href="/bienvenue">réseaux sociaux</a>, et nous contacter par
    <a href="mailto:lejdl@laroche.org">mail</a>.<br />
  </p>
  <!-- <div class="archives">
      <p class="title-archives"><b>Vous cherchez les anciens articles et vidéos ?</b></p>
      <p>Patientez encore quelques jours, ils sont en cours d'intégration sur notre nouveau blog !</p>
    </div> -->
  <!-- <div class="archives" style="background-color: #f1ffe8">
      <p class="title-archives"><b>Les anciens articles et vidéos on été ajoutés !</b></p>
      <p>Vous pouvez dès maintenant les retrouver dans leur rubrique correspondante.</p>
    </div> -->
</div>

<h2>Nos derniers podcasts radio</h2>
<ImportantList shows={data.shows} />

<h2>Nos dernières vidéos</h2>
<ImportantList videos={data.videos} />

<h2>Notre dernier article</h2>
<List articles={[data.articles[0]]} />

<h2>La Rédaction</h2>
<!-- for journalists -->
<div class="editorial-staff">
  <p class="name">... journalistes</p>
  <p class="class" />
</div>
