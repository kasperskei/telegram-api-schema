import {
  parseHtmlPage,
} from '@/api/parse-html-page.ts'
import {
  parseSchema,
} from '@/api/parse-schema.ts'

export const basePath = 'https://core.telegram.org'

export const getSchema = async () => {
  return await fetch(basePath + '/schema/json')
    .then((response) => response.json())
    .then((body) => parseSchema(body))
}

export const getHtmlPage = async (href: string) => {
  return await fetch(href)
    .then((response) => response.text())
    .then((body) => parseHtmlPage(body))
}
