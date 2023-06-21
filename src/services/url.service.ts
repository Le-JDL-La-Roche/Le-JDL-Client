export default class UrlService {
  slugify(string: string): string {
    const a = 'àáäâãåăæąçćčđďèéëêęěėğìíïîłñńňòóöôõøőðřśšşșťțùúüûůűųūýÿžźż'
    const b = 'aaaaaaaaacccddeeeeeeegiiiilnnnoooooooorssssttuuuuuuuuyyzzz'
    const p = new RegExp(a.split('').join('|'), 'g')

    return string
      .unescapeHtml()
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/['"’]/g, '-')
      .replace(p, (c) => b.charAt(a.indexOf(c)))
      .replace(/&/g, '-and-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  }

  idToSlug(id: string | number): string {
    return (`00000${id}`).slice(-5)
  }
}

declare global {
  interface String {
    unescapeHtml(): string
  }
}

String.prototype.unescapeHtml = function (): string {
  return this.replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', "'")
}
