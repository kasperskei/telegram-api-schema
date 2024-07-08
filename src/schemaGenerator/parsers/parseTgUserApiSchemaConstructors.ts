import {TgUserApiJSONSchemaConstructor} from '@/schemaGenerator/types/TgUserApiJSONSchema.ts'
import {TgUserApiSchemaConstructor} from '@/schemaGenerator/types/TgUserApiSchema.ts'
import {parseTgUserApiSchemaParams} from '@/schemaGenerator/parsers/parseTgUserApiSchemaParams.ts'
import {parseTgUserApiTypeName} from '@/schemaGenerator/parsers/parseTgUserApiTypeName.ts'

const TgUserApiSchemaExcludePredicates = [
  'boolFalse',
  'boolTrue',
  'true',
  'null',
  'vector',
]

export const parseTgUserApiSchemaConstructors = (constructors: TgUserApiJSONSchemaConstructor[]): TgUserApiSchemaConstructor[] => constructors
  .filter(({predicate}) => !TgUserApiSchemaExcludePredicates.includes(predicate))
  .map((it) => ({
    description: '',
    params: parseTgUserApiSchemaParams(it.params),
    predicate: it.predicate,
    typeName: parseTgUserApiTypeName(`predicate_${it.predicate}`).typeName,
    groupTypeName: parseTgUserApiTypeName(it.type).typeName,
  }))
