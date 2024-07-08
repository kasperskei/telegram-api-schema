import {TgUserApiJSONSchema} from '@/schemaGenerator/types/TgUserApiJSONSchema.ts'

export const getSchema = async (): Promise<TgUserApiJSONSchema> => {
  return await fetch('https://core.telegram.org/schema/json').then((response) => response.json())
}

export const getSchemaConstructor = async (constructor: string): Promise<string> => {
  return await fetch('https://core.telegram.org/constructor/' + constructor).then((response) => response.text())
}

export const getSchemaMethod = async (method: string): Promise<string> => {
  return await fetch('https://core.telegram.org/method/' + method).then((response) => response.text())
}
