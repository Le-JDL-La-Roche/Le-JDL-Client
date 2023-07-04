<script lang="ts">
  import { onMount } from 'svelte'
  import type { PageData } from './$types'
  import Chart from 'chart.js/auto'
  import ChartDataLabels from 'chartjs-plugin-datalabels'

  export let data: PageData

  let webradioCanvas: HTMLCanvasElement

  let visitsChart: any
  let visitsData: { x: string; y: number }[] = []
  let visitsDataSliced: { x: string; y: number }[] = []
  let visitsRange = 7

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Europe/Paris'
  }
  const formatter = new Intl.DateTimeFormat('fr-FR', options)

  data.data!.visits.visits.forEach((visits) => {
    visitsData.push({
      x: formatter.format(new Date(visits.timestamp * 1000)),
      y: visits.visits
    })
  })

  onMount(() => {
    visitsChart = new Chart(webradioCanvas, {
      type: 'bar',
      plugins: [ChartDataLabels],
      data: {
        datasets: [
          {
            label: '# de visites',
            data: visitsDataSliced,
            borderWidth: 1
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        aspectRatio: 1,
        responsive: true,
        animation: false,
        plugins: {
          legend: {
            display: false
          },
          datalabels: {
            // display only non-zero values
            display: (context) => {
              let data = context.dataset.data[context.dataIndex] as unknown as { x: string; y: number }
              return data.y !== 0
            },
            formatter: (value) => {
              return value.y
            }
          }
        },
        scales: {
          x: {
            reverse: false
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    })

    sliceVisits(visitsRange)
  })

  function sliceVisits(n: number) {
    if (n !== 0 && n !== 90) {
      visitsDataSliced = visitsData.slice(0, n).reverse()
    } else if (n === 90) {
      visitsDataSliced = []
      const optionsWeek: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }
      const formatterWeek = new Intl.DateTimeFormat('fr-FR', optionsWeek)
      let date = new Date(data.data!.visits.visits[0].timestamp * 1000)
      let y = 0
      data.data!.visits.visits.slice(0, 90).forEach((visits, i) => {
        const date_ = new Date(visits.timestamp * 1000)
        if ((i + 1) % 7 === 0) {
          visitsDataSliced.push({
            x: `${formatterWeek.format(date_)} - ${formatterWeek.format(date)}`,
            y
          })
          y = 0
          date = new Date(visits.timestamp * 1000 - 86400000)
        }
        y += visits.visits
      })
      visitsDataSliced = visitsDataSliced.reverse()
    } else {
      visitsDataSliced = []
      let date = new Date(data.data!.visits.visits[0].timestamp * 1000)
      let month = date.toLocaleString('fr-FR', { month: 'long' })
      let year = date.getFullYear()
      let y = 0
      data.data!.visits.visits.forEach((visits) => {
        const date_ = new Date(visits.timestamp * 1000)
        const month_ = date_.toLocaleString('fr-FR', { month: 'long' })
        const year_ = date_.getFullYear()
        if (month_ !== month) {
          visitsDataSliced.push({
            x: `${month} ${year}`,
            y
          })
          y = 0
        }
        date = date_
        month = month_
        year = year_
        y += visits.visits
      })
      visitsDataSliced = visitsDataSliced.reverse()
    }
    visitsChart.data.datasets[0].data = visitsDataSliced
    visitsChart.update()
  }
</script>

<svelte:head>
  <title>Informations du Blog • Le JDL - La Roche</title>
</svelte:head>

<h2>
  <a href="/admin">Espace administration</a>&nbsp;&nbsp;<i class="fa-solid fa-caret-right" />&nbsp; Informations du Blog
</h2>

<select
  bind:value={visitsRange}
  style="position: relative;
    width: auto !important;
    min-width: 200px;
    max-width: 300px;
    top: -5px;
    float: right"
  on:change={() => sliceVisits(visitsRange)}
>
  <option value={7}>7 derniers jours</option>
  <option value={15}>15 derniers jours</option>
  <option value={30}>30 derniers jours</option>
  <option value={90}>3 derniers mois (en semaines)</option>
  <option value={0}>Tout (en mois)</option>
</select>

<h3>Visites</h3>
<div class="chart">
  <canvas bind:this={webradioCanvas} />
</div>

<style lang="scss">
  div.chart {
    height: 250px;

    canvas {
      height: 250px;
      max-height: 250px;
    }
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
