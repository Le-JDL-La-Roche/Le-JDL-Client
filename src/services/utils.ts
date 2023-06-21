class Utils {
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

  // create a function that transforms a timestamp (in seconds) into a string in the format dd MM yyyy (eg. 01 janvier 2023):
  timestampToString(timestamp: number): string {
    const date = new Date(timestamp * 1000)
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    return `${day} ${this.monthToString(month)} ${year}`
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
