export default class ContentService {
  replaceNewLineByBr(string: string): string {
    return string.replaceAll('\n', '<br>')
  }

  getChapo(string: string): string {
    return (string.match(/### (.+) ###/g) + '').replace('### ', '').replace(' ###', '')
  }

  markdownToHtml(string: string): string {
    return string
      .replaceAll(/\*\*(.+)\*\*/g, '<b>$1</b>')
      .replaceAll(/\*(.+)\*/g, '<i>$1</i>')
      .replaceAll(/_(.+)_/g, '<i>$1</i>')
      .replaceAll(/__(.+)__/g, '<u>$1</u>')
      .replaceAll(/~~(.+)~~/g, '<s>$1</s>')
      .replaceAll(/\[(.+)\]\((.+)\)/g, '<a href="$2">$1</a>')
      .replaceAll(/\[(.+)\]_\((.+)\)/g, '<a href="$2" target="blank_">$1</a>')
      .replaceAll(
        /\[(.+)\]\[(.+)\]\((.+)\)/g,
        '<figure><img src="$3" alt="$1"><figcaption>$1<p class="img-src">$2</p></figcaption></figure>'
      )
      .replaceAll(
        /!\((.+)\)/g,
        '<iframe src="$1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'
      )
      .replaceAll(/^# (.+)/gm, '<h1>$1</h1>')
  }
}
