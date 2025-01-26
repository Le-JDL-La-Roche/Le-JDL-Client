export interface Article {
  id?: number
  title: string
  article: string
  thumbnail: string
  thumbnailSrc: string
  // category: 'news' | 'culture' | 'sport' | 'science' | 'tech' | 'laroche' | ''
  category: 'france' | 'international' | 'culture' | 'sport' | 'science' | 'laroche' | ''
  author: string
  date: string
  views?: number
  /**
   * `-2` Draft/Waiting for authorization
   *
   * ` 2` Published
   */
  status: -2 | 2
}

