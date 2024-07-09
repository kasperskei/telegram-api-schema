import {
  type TgUserApiJSONSchemaMethod,
} from '@/schemaGenerator/types/TgUserApiJSONSchema.ts'
import {
  type TgUserApiSchemaMethod,
} from '@/schemaGenerator/types/TgUserApiSchema.ts'
import {
  parseTgUserApiSchemaParams,
} from '@/schemaGenerator/parsers/parseTgUserApiSchemaParams.ts'
import {
  parseTgUserApiTypeName,
} from '@/schemaGenerator/parsers/parseTgUserApiTypeName.ts'
import {basePath} from '@/schemaGenerator/api.ts'

export const parseTgUserApiSchemaMethods = (methods: TgUserApiJSONSchemaMethod[]): TgUserApiSchemaMethod[] => methods
  .map((method) => ({
    description: '',
    method: method.method,
    params: parseTgUserApiSchemaParams(method.params),
    methodName: parseTgUserApiTypeName(method.method, false).typeName,
    returnTypeName: parseTgUserApiTypeName(method.type).typeName,
    link: basePath + '/method/' + method.method,
  }))
