export interface Env {
  visits: Visits
  shows: Shows
  videos: Videos
  articles: Articles
}

interface Visits {
  total: number
  visits: {
    id: number
    timestamp: number
    visits: number
  }[]
}

interface Shows {
  total: number
  status: {
    draft: number
    live: number
    waiting: number
    podcast: number
  }
}

interface Videos {
  total: number
  category: {
    news: number
    culture: number
    sport: number
    science: number
    tech: number
    laroche: number
  }
  type: {
    youtube: number
    instagram: number
  }
}

interface Articles {
  total: number
  category: {
    news: number
    culture: number
    sport: number
    science: number
    tech: number
    laroche: number
  }
}
