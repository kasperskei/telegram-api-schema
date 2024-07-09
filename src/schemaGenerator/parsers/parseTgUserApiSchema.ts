
import {
  type TgUserApiSchema,
} from '@/schemaGenerator/types/TgUserApiSchema.ts'
import {
  type TgUserApiJSONSchema,
} from '@/schemaGenerator/types/TgUserApiJSONSchema.ts'
import {
  parseTgUserApiSchemaMethods,
} from '@/schemaGenerator/parsers/parseTgUserApiSchemaMethods.ts'
import {
  parseTgUserApiSchemaConstructors,
} from '@/schemaGenerator/parsers/parseTgUserApiSchemaConstructors.ts'

export const parseTgUserApiSchema = (schema: TgUserApiJSONSchema): TgUserApiSchema => {
  return {
    constructors: parseTgUserApiSchemaConstructors(schema.constructors),
    methods: parseTgUserApiSchemaMethods(schema.methods),
  }
}