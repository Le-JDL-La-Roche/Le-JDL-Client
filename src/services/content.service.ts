import { api } from './store'

export default class ContentService {
  replaceNewLineByBr(string: string): string {
    return string.replaceAll('\n', '<br>')
  }

  getChapo(string: string): string {
    return (string.match(/^### (.+) ###/gm) + '').replace('### ', '').replace(' ###', '')
  }

  markdownToHtml(string: string): string {
    const r = string
      .replaceAll(/^###( |&nbsp;|\xa0)(.+)( |&nbsp;|\xa0)###/gm, '')
      .replaceAll(/^\n+|\n+$/g, '')
      .replaceAll('\n', '<br>\n')
      .replaceAll(/^\s+|\s+$/g, '')
      .replaceAll(/^#( |&nbsp;|\xa0)(.+)/gm, '<h4>$2</h4>')
      .replaceAll(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replaceAll(/\*(.+?)\*/g, '<i>$1</i>')
      .replaceAll(/__(.+?)__/g, '<u>$1</u>')
      .replaceAll(/~~(.+?)~~/g, '<s>$1</s>')
      .replaceAll(
        /\[(.+)\]\[(.+)\]\((.+)\)/g,
        '<figure><img src="$3" alt="$1" /><figcaption>$1<p><i>Source : $2</i></p></figcaption></figure>'
      )
      .replaceAll(/<br>\n<figure>/g, '<figure>')
      .replaceAll(/<br><figure>/g, '<figure>')
      .replaceAll(/<\/figure><br>/g, '</figure>')
      .replaceAll(/<\/figure>\n<br>/g, '</figure>')
      .replaceAll(/<\/figure><br>\n/g, '</figure>')
      .replaceAll(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
      .replaceAll(/\[(.+?)\]_\((.+?)\)/g, '<a href="$2" target="blank_">$1</a>')
      .replaceAll(/^> ((.|\n)+) <$/gm, '<blockquote>$1</blockquote>')
      .replaceAll(
        /!\((.+?)\)/g,
        '<iframe src="https://www.youtube.com/embed/$1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'
      )
      .replaceAll(/<br>\n<iframe/g, '<iframe')
      .replaceAll(/<br><iframe/g, '<iframe')
      .replaceAll(/<\/iframe><br>/g, '</iframe>')
      .replaceAll(/<\/iframe>\n<br>/g, '</iframe>')
      .replaceAll(/<\/iframe><br>\n/g, '</iframe>')
      .replaceAll(' !', '&nbsp;!')
      .replaceAll(' ?', '&nbsp;?')
      .replaceAll(' :', '&nbsp;:')
      .replaceAll(' ;', '&nbsp;;')
      console.log(r);
      return r
  }
}
