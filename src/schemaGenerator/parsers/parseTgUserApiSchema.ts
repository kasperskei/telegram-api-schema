import {TgUserApiJSONSchema} from '@/schemaGenerator/types/TgUserApiJSONSchema.ts'
import {parseTgUserApiSchemaMethods} from '@/schemaGenerator/parsers/parseTgUserApiSchemaMethods.ts'
import {parseTgUserApiSchemaConstructors} from '@/schemaGenerator/parsers/parseTgUserApiSchemaConstructors.ts'

export const parseTgUserApiSchema = (schema: TgUserApiJSONSchema) => {
  return {
    constructors: parseTgUserApiSchemaConstructors(schema.constructors),
    methods: parseTgUserApiSchemaMethods(schema.methods),
  }
}