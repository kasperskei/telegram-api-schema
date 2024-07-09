import {
  parseHTML,
} from 'linkedom'
import Turndown from 'turndown'
import {
  basePath,
} from '@/api/index.ts'

const turndownService = new Turndown()

export const parseHtmlPage = (html: string) => {
  const {document} = parseHTML(html)

  const content = document.querySelector('#dev_page_content')!
  content.querySelector('dev_page_content')?.remove()

  content.querySelectorAll('a').forEach((anchor) => {
    anchor.href = basePath + anchor.href
  })

  const description = turndownService.turndown(content.children.item(0)?.innerHTML ?? '')
  const params = Object.fromEntries(Array.from(content.querySelector('#parameters')
    ?.parentElement
    ?.nextElementSibling
    ?.querySelector('tbody')
    ?.querySelectorAll('tr')
    ?.values() ?? []
  ).map((tr) => [
    tr.children.item(0)?.textContent,
    tr.children.item(2)?.textContent,
  ]))

  // const related = content.querySelector('#related-pages')?.parentElement?.nextElementSibling

  return {
    description,
    params,
  }
}
