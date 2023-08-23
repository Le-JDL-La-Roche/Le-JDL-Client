export interface WebradioShow {
  id?: number
  title: string
  description: string
  thumbnail: string | File
  streamId: string
  podcastId?: string
  status: -2 | -1 | 0 | 1 | 2
  date: string
}
