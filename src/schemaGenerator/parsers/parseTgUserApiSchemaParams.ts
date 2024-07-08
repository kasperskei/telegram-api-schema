import {TgUserApiJSONSchemaParam} from '@/schemaGenerator/types/TgUserApiJSONSchema.ts'
import {TgUserApiSchemaParam} from '@/schemaGenerator/types/TgUserApiSchema.ts'
import {parseTgUserApiTypeName} from '@/schemaGenerator/parsers/parseTgUserApiTypeName.ts'

export const parseTgUserApiSchemaParams = (params: TgUserApiJSONSchemaParam[]): TgUserApiSchemaParam[] => params
  .filter(({type}) => type !== '#')
  .map((param) => {
    const {
      isMaybe,
      typeName,
    } = parseTgUserApiTypeName(param.type)

    return {
      description: '',
      isMaybe,
      propName: param.name,
      typeName,
    }
  })
