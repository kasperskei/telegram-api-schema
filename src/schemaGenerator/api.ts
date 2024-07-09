import {
  TgUserApiJSONSchema,
} from '@/schemaGenerator/types/TgUserApiJSONSchema.ts'

export const basePath = 'https://core.telegram.org'

export const getSchema = async (): Promise<TgUserApiJSONSchema> => {
  return await fetch(basePath + '/schema/json').then((response) => response.json())
}

export const getHtmlPage = async (href: string): Promise<string> => {
  return await fetch(href).then((response) => response.text())
}
