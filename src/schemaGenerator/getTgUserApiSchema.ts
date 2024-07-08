import path from 'path'
import {TgUserApiSchema} from '@/schemaGenerator/types/TgUserApiSchema.ts'
import {TgUserApiJSONSchema} from '@/schemaGenerator/types/TgUserApiJSONSchema.ts'
import {readJSONFile} from '@/utils/file/readJSONFile.ts'
import {parseTgUserApiSchemaConstructors} from '@/schemaGenerator/parsers/parseTgUserApiSchemaConstructors.ts'
import {parseTgUserApiSchemaMethods} from '@/schemaGenerator/parsers/parseTgUserApiSchemaMethods.ts'
import {groupBy} from '@/utils/groupBy.ts'

export const getTgUserApiSchema = async (): Promise<TgUserApiSchema> => {
  const tgUserApiJSONSchema = await fetch('https://core.telegram.org/schema/json').then((response) => response.json())
  const constructors = parseTgUserApiSchemaConstructors(tgUserApiJSONSchema.constructors)
  const constructorsByType = groupBy(constructors, (it) => it.groupTypeName)
  const methods = parseTgUserApiSchemaMethods(tgUserApiJSONSchema.methods)

  console.log('>>>', constructors.slice(0, 5))
  console.log('>>>', methods.slice(0, 5))

  return {
    constructors,
    constructorsByType,
    methods,
  }
}
