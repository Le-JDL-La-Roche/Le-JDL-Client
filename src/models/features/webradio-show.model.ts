export interface WebradioShow {
  id?: number
  title: string
  description: string
  thumbnail: string | File
  streamId: string
  podcastId?: string
  /**
   * `-2` Draft – `-2.5` Draft restream
   *
   * `-1` Wait stream – `-1.5` Wait restream
   *
   * ` 0` Live stream – `0.5` Live restream
   *
   * ` 1` Waiting podcast
   *
   * ` 2` Podcast
   */
  status: -2 | -2.5 | -1 | -1.5 | 0 | 0.5 | 1 | 2
  date: string
  prompter?: string | { title: string; content: string }[]
}
