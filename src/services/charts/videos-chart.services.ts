import Chart from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import type { PageData } from '../../routes/(main)/admin/stats/$types'
import type { Env } from '$models/data/env.model'
import utils from '../utils'

export class VideoChart extends Chart {
  private readonly labels = {
    type: {
      labels: ['Instagram', 'YouTube'],
      backgroundColors: ['#feaa23', '#ff0000']
    },
    category: {
      labels: ['Actualités', 'Culture', 'Sport', 'Sciences', 'Tech', 'La Roche'],
      backgroundColors: ['#f51527', '#f5a527', '#3bad15', '#15f5aa', '#3715f5', '#c31718']
    }
  }
  private display: 'type' | 'category' = 'category'

  private rawData: Env['videos']
  private videosData: number[] = []

  constructor(ctx: HTMLCanvasElement, data: PageData) {
    super(ctx, {
      type: 'doughnut',
      plugins: [ChartDataLabels],
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
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
              return `${this.labels[this.display].labels[ctx.dataIndex]} : ${value}`
            }
          }
        }
      }
    })

    this.rawData = data.data!.videos
    this.videosData = [
      this.rawData.category.news,
      this.rawData.category.culture,
      this.rawData.category.sport,
      this.rawData.category.science,
      this.rawData.category.tech,
      this.rawData.category.laroche
    ]
    this.data.labels = this.labels.category.labels
    this.data.datasets![0].data = this.videosData
    this.data.datasets![0].backgroundColor = this.labels.category.backgroundColors
    this.update()
  }

  updateDisplay(display: 'type' | 'category') {
    this.display = display
    this.data.labels = this.labels[display].labels
    if (display === 'category') {
      this.videosData = [
        this.rawData.category.news,
        this.rawData.category.culture,
        this.rawData.category.sport,
        this.rawData.category.science,
        this.rawData.category.tech,
        this.rawData.category.laroche
      ]
    } else {
      this.videosData = [this.rawData.type.instagram, this.rawData.type.youtube]
    }
    this.data.datasets![0].data = this.videosData
    this.data.datasets![0].backgroundColor = this.labels[display].backgroundColors
    this.update()
  }
}
