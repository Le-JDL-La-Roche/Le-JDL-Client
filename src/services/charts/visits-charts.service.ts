import Chart from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import type { PageData } from '../../routes/(main)/admin/infos/$types'
import type { Env } from '$models/data/env.model'
import utils from '../utils'

export class VisitsChart extends Chart {
  private slicedData: { x: string; y: number }[] = []
  private visitsData: { x: string; y: number }[] = []
  private rawData: Env['visits']['visits'] = []

  total: number = 0

  constructor(ctx: HTMLCanvasElement, data: PageData) {
    super(ctx, {
      type: 'bar',
      plugins: [ChartDataLabels],
      data: {
        datasets: [
          {
            label: '# de visites',
            data: [],
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
          legend: { display: false },
          datalabels: {
            display: (ctx) => {
              let data = ctx.dataset.data[ctx.dataIndex] as unknown as { x: string; y: number }
              return data.y !== 0
            },
            formatter: (value) => {
              return value.y
            }
          }
        },
        scales: {
          x: { reverse: false },
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    })

    this.rawData = data.data!.visits.visits
    this.rawData.forEach((visits) => {
      this.visitsData.push({
        x: utils.shortDateFormatter.format(new Date(visits.timestamp * 1000)),
        y: visits.visits
      })
    })

    this.updateRange(7)
  }

  updateRange(n: number) {
    this.total = 0
    if (n !== 0 && n !== 90) {
      this.slicedData = this.visitsData.slice(0, n)
    } else if (n === 90) {
      this.slicedData = []
      let date = new Date(this.rawData[0].timestamp * 1000)
      let y = 0
      this.rawData.slice(0, 90).forEach((visits, i) => {
        const date_ = new Date(visits.timestamp * 1000)
        if ((i + 1) % 7 === 0) {
          this.slicedData.push({
            x: `${utils.digitalDateFormatter.format(date_)} - ${utils.digitalDateFormatter.format(date)}`,
            y
          })
          y = 0
          date = new Date(visits.timestamp * 1000 - 86400000)
        }
        y += visits.visits
      })
    } else {
      this.slicedData = []
      let date = new Date(this.rawData[0].timestamp * 1000)
      let month = date.toLocaleString('fr-FR', { month: 'long' })
      let year = date.getFullYear()
      let y = 0
      this.rawData.forEach((visits) => {
        const date_ = new Date(visits.timestamp * 1000)
        const month_ = date_.toLocaleString('fr-FR', { month: 'long' })
        const year_ = date_.getFullYear()
        if (month_ !== month) {
          this.slicedData.push({
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
      this.slicedData.push({
        x: `${month} ${year}`,
        y
      })
    }
    this.slicedData.forEach((data) => {
      this.total += data.y
    })
    this.data.datasets[0].data = this.slicedData.reverse() as any
    this.update()
  }
}
