import Chart from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import type { PageData } from '../../routes/(main)/admin/infos/$types'
import type { Env } from '$models/data/env.model'
import utils from '../utils'

export class ArticlesChart extends Chart {
  private articlesData: number[] = []

  constructor(ctx: HTMLCanvasElement, data: PageData) {
    super(ctx, {
      type: 'doughnut',
      plugins: [ChartDataLabels],
      data: {
        labels: ['Actualités', 'Culture', 'Sport', 'Sciences', 'Tech', 'La Roche'],
        datasets: [
          {
            data: [],
            backgroundColor: ['#f51527', '#f5a527', '#3bad15', '#15f5aa', '#3715f5', '#c31718'],
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
              const labels = ['Actualités', 'Culture', 'Sport', 'Sciences', 'Tech', 'La Roche']
              return `${labels[ctx.dataIndex]} : ${value}`
            }
          }
        }
      }
    })

    this.articlesData = [
      data.data!.articles.category.news,
      data.data!.articles.category.culture,
      data.data!.articles.category.sport,
      data.data!.articles.category.science,
      data.data!.articles.category.tech,
      data.data!.articles.category.laroche
    ]
    this.data.datasets![0].data = this.articlesData
    this.update()
  }
}
