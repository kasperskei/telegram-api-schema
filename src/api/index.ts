import {
  parseHtmlPage,
} from '@/api/parse-html-page.ts'
import {
  parseSchema,
} from '@/api/parse-schema.ts'
import {
  parseErrors,
} from '@/api/parse-errors.ts'

export const basePath = 'https://core.telegram.org'

/**
 * @see https://core.telegram.org/schema
 */
export const getSchema = async () => {
  return await fetch(basePath + '/schema/json')
    .then((response) => response.json())
    .then((body) => parseSchema(body))
}

/**
 * @see https://core.telegram.org/methods
 */
export const getHtmlPage = async (href: string) => {
  return await fetch(href)
    .then((response) => response.text())
    .then((body) => parseHtmlPage(body))
}

/**
 * @see https://core.telegram.org/api/errors
 */
export const getErrors = async () => {
  return await fetch(basePath + '/file/400780400424/4/FCP9Vyccaho.111662.json/d7d1b7ba612b54a702')
    .then((response) => response.json())
    .then((body) => parseErrors(body))
}
