import type { Article } from '$models/features/article.model'
import type { Video } from '$models/features/video.model'
import type { WebradioShow } from '$models/features/webradio-show.model'
import type { RequestHandler } from './$types'
import utils from '$services/utils'
import { api } from '$services/store'
import UrlService from '$services/url.service'

const url = new UrlService()

const siteUrl = 'https://le-jdl-laroche.cf'

export const GET: RequestHandler = async ({ fetch, setHeaders }) => {
  let shows: WebradioShow[] = []
  let videos: Video[] = []
  let articles: Article[] = []

  const r1 = await fetch(`${api}/webradio/shows`)
  const r2 = await fetch(`${api}/videos`)
  const r3 = await fetch(`${api}/articles`)

  if (r1.ok) {
    shows = (await r1.json()).data?.shows || []
  }

  if (r2.ok) {
    videos = (await r2.json()).data?.videos || []
  }

  if (r3.ok) {
    articles = (await r3.json()).data?.articles || []
  }

  setHeaders({
    'Content-Type': 'application/xml'
  })

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>    
  ${utils.categories
    .map(
      (c) => `<url>
    <loc>${siteUrl}/${c}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`
    )
    .join('')}
  ${shows
    .map(
      (s) => `<url>
    <loc>${siteUrl}/radio/podcast/${url.idToSlug(s.id || 0)}--${url.slugify(s.title)}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')}
  ${videos
    .map(
      (v) => `<url>
    <loc>${siteUrl}/${
        utils.categoriesFr[v.category as 'actualites' | 'culture' | 'sport' | 'sciences' | 'tech' | 'laroche'].slug
      }/video/${url.idToSlug(v.id || 0)}--${url.slugify(v.title)}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')}
  ${articles
    .map(
      (a) => `<url>
    <loc>${siteUrl}/${
        utils.categoriesFr[a.category as 'actualites' | 'culture' | 'sport' | 'sciences' | 'tech' | 'laroche'].slug
      }/article/${url.idToSlug(a.id || 0)}--${url.slugify(a.title)}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')}
</urlset>`
  )
}
