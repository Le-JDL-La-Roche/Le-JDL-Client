<script lang="ts">
  import { onMount } from 'svelte'
  import type { PageData } from './$types'
  import utils from '$services/utils'
  import { VisitsChart } from '$services/charts/visits-charts.service'
  import { WebradioChart } from '$services/charts/webradio-charts.service'
  import { VideoChart } from '$services/charts/videos-chart.services'
  import { ArticlesChart } from '$services/charts/articles-chart.service'
  import ApiEnvService from '$services/api/api-env.service'
  import type { Journalist } from '$models/data/journalist.model'
  import AddEditJournalistModal from '$components/modals/AddEditJournalistModal.svelte'

  export let data: PageData

  let visitsCanvas: HTMLCanvasElement
  let visitsChart: VisitsChart
  let visitsRange = 7

  let webradioCanvas: HTMLCanvasElement
  let webradioChart: WebradioChart

  let videosCanvas: HTMLCanvasElement
  let videosChart: VideoChart
  let videosDisplay: 'category' | 'type' = 'category'

  let articlesCanvas: HTMLCanvasElement
  let articlesChart: ArticlesChart

  onMount(() => {
    visitsChart = new VisitsChart(visitsCanvas, data)
    webradioChart = new WebradioChart(webradioCanvas, data)
    videosChart = new VideoChart(videosCanvas, data)
    articlesChart = new ArticlesChart(articlesCanvas, data)
  })
</script>

<svelte:head>
  <title>Statistiques • Le JDL - La Roche</title>
</svelte:head>

<h2>
  <a href="/admin">Espace administration</a>&nbsp;&nbsp;<i class="fa-solid fa-caret-right" />&nbsp; Statistiques du Blog
</h2>

<select bind:value={visitsRange} class="range" on:change={() => visitsChart.updateRange(visitsRange)}>
  <option value={7}>7 derniers jours</option>
  <option value={15}>15 derniers jours</option>
  <option value={30}>30 derniers jours</option>
  <option value={90}>3 derniers mois (en semaines)</option>
  <option value={0}>Tout (en mois)</option>
</select>
<h3>Visites ({data.data?.visits.total})</h3>
<div class="chart">
  <canvas bind:this={visitsCanvas} />
</div>

<h3>Webradio ({data.data?.shows.total})</h3>
<div class="chart">
  <canvas bind:this={webradioCanvas} />
</div>

<select bind:value={videosDisplay} class="range" on:change={() => videosChart.updateDisplay(videosDisplay)}>
  <option value={'category'}>Rubrique</option>
  <option value={'type'}>Type de vidéo</option>
</select>
<h3>Videos ({data.data?.videos.total})</h3>
<div class="chart">
  <canvas bind:this={videosCanvas} />
</div>

<h3>Videos ({data.data?.articles.total})</h3>
<div class="chart">
  <canvas bind:this={articlesCanvas} />
</div>

<style lang="scss">
  div.chart {
    height: 250px;
    margin-bottom: 35px;

    canvas {
      height: 250px;
      max-height: 250px;
    }
  }

  select.range {
    position: relative;
    width: auto !important;
    min-width: 200px;
    max-width: 300px;
    top: -5px;
    float: right;
  }

  @media screen and (min-width: 850px) {
    div.chart {
      height: 250px;

      canvas {
        height: 250px;
        max-height: 250px;
      }
    }

    @media screen and (min-width: 1150px) {
      div.chart {
        height: 300px;

        canvas {
          height: 300px;
          max-height: 300px;
        }
      }
    }
  }
</style>
