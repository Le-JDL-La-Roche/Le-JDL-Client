import Chart from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import type { PageData } from '../../routes/(main)/admin/stats/$types'
import type { Env } from '$models/data/env.model'
import utils from '../utils'

export class WebradioChart extends Chart {
  private showsData: number[] = []

  constructor(ctx: HTMLCanvasElement, data: PageData) {
    super(ctx, {
      type: 'doughnut',
      plugins: [ChartDataLabels],
      data: {
        labels: ['Brouillons', 'En direct', 'En attente', 'Publiés'],
        datasets: [
          {
            data: [],
            backgroundColor: ['#ff9696', '#f74d4d', '#87ed87', '#34cf4d'],
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
              let value = ctx.dataset.data[ctx.dataIndex]
              return value !== 0
            },
            formatter: (value, ctx) => {
              const labels = ['Brouillons/Attente', 'Salle d\'attente/direct/rediff.', 'En vérification', 'Publiés']
              return `${labels[ctx.dataIndex]} : ${value}`
            }
          }
        }
      }
    })

    this.showsData = [
      data.data?.shows.status.draft || 0,
      data.data?.shows.status.live || 0, // includes wait stream
      data.data?.shows.status.waiting || 0,
      data.data?.shows.status.podcast || 0
    ]
    this.data.datasets![0].data = this.showsData
    this.update()
  }
}
