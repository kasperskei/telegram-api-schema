import {TgUserApiJSONSchemaMethod} from '@/schemaGenerator/types/TgUserApiJSONSchema.ts'
import {TgUserApiSchemaMethod} from '@/schemaGenerator/types/TgUserApiSchema.ts'
import {parseTgUserApiSchemaParams} from '@/schemaGenerator/parsers/parseTgUserApiSchemaParams.ts'
import {parseTgUserApiTypeName} from '@/schemaGenerator/parsers/parseTgUserApiTypeName.ts'

export const parseTgUserApiSchemaMethod = (methods: TgUserApiJSONSchemaMethod[]): TgUserApiSchemaMethod[] => methods
  .map((method) => ({
    description: '',
    method: method.method,
    params: parseTgUserApiSchemaParams(method.params),
    methodName: parseTgUserApiTypeName(method.method, false).typeName,
    returnTypeName: parseTgUserApiTypeName(method.type).typeName,
  }))
