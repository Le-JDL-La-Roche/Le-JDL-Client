class Utils {
  readonly categories = ['actualites', 'culture', 'sport', 'sciences', 'tech', 'laroche', 'radio']
  readonly categoriesFr = {
    actualites: {
      name: 'Actualités',
      slug: 'actualites',
      id: 'news',
      icon: 'fa-newspaper',
      color: '#f51527'
    },
    news: {
      name: 'Actualités',
      slug: 'actualites',
      id: 'news',
      icon: 'fa-newspaper',
      color: '#f51527'
    },
    culture: {
      name: 'Culture',
      slug: 'culture',
      id: 'culture',
      icon: 'fa-book',
      color: '#f5a527'
    },
    sport: {
      name: 'Sport',
      slug: 'sport',
      id: 'sport',
      icon: 'fa-futbol',
      color: '#3bad15'
    },
    sciences: {
      name: 'Sciences',
      slug: 'sciences',
      id: 'science',
      icon: 'fa-dna',
      color: '#15f5aa'
    },
    science: {
      name: 'Sciences',
      slug: 'sciences',
      id: 'science',
      icon: 'fa-dna',
      color: '#15f5aa'
    },
    tech: {
      name: 'Tech',
      slug: 'tech',
      id: 'tech',
      icon: 'fa-microchip',
      color: '#3715f5'
    },
    laroche: {
      name: 'La Roche',
      slug: 'laroche',
      id: 'laroche',
      icon: 'fa-star',
      color: '#c31718'
    },
    radio: {
      name: 'Podcasts radio',
      slug: 'radio',
      id: 'radio',
      icon: 'fa-podcast',
      color: '#72238e'
    }
  }

  private readonly shortDateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Europe/Paris'
  }

  readonly shortDateFormatter = new Intl.DateTimeFormat('fr-FR', this.shortDateOptions)

  private readonly digitalDateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Europe/Paris'
  }

  readonly digitalDateFormatter = new Intl.DateTimeFormat('fr-FR', this.digitalDateOptions)

  sleep(duration: number) {
    return new Promise((resolve) => setTimeout(resolve, duration))
  }

  toFirstLetterUppercase(string: string): string {
    let strs: string[] = string.toLocaleLowerCase().split(' ')
    let strs_ = []

    for (let value of strs) {
      let f = value.charAt(0).toUpperCase()
      let s = value.slice(1)
      strs_.push(f + '' + s)
    }

    string = strs_.join(' ')
    strs_ = []

    strs = string.split('-')

    for (let value of strs) {
      let f = value.charAt(0).toUpperCase()
      let s = value.slice(1)
      strs_.push(f + '' + s)
    }

    return strs_.join('-')
  }

  timestampToString(timestamp: number): string {
    const date = new Date(timestamp * 1000)
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    return `${day} ${this.monthToString(month)} ${year}`
  }

  timestampToHour(timestamp: number): string {
    const date = new Date(timestamp * 1000)
    const hour = date.getHours()
    const minutes = date.getMinutes()
    return `${hour < 10 ? '0' + hour : hour}:${minutes < 10 ? '0' + minutes : minutes}`
  }

  timestampToDate(timestamp: number): string {
    const date = new Date(timestamp * 1000)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
  }

  monthToString(month: number): string {
    const months = ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
    return months[month]
  }

  categoryToString(category: 'news' | 'culture' | 'sport' | 'science' | 'tech' | 'laroche' | ''): string {
    const categories = {
      news: 'Actualités',
      culture: 'Culture',
      sport: 'Sport',
      science: 'Sciences',
      tech: 'Tech',
      laroche: 'La Roche',
      '': 'Divers'
    }
    return categories[category]
  }
}

export default new Utils()
