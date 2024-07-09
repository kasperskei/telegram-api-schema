
import {
  type TgUserApiSchema,
} from '@/schemaGenerator/types/TgUserApiSchema.ts'
import {
  type TgUserApiSchemaConstructor,
} from '@/schemaGenerator/types/TgUserApiSchema.ts'
import {
  type TgUserApiSchemaMethod,
} from '@/schemaGenerator/types/TgUserApiSchema.ts'
import {
  type TgUserApiSchemaParam,
} from '@/schemaGenerator/types/TgUserApiSchema.ts'
import {
  camelCase,
} from '@/utils/string/camel-case.ts'
import {
  basePath,
} from '@/api/index.ts'

interface SchemaParamDto {
  name: string
  type: string
}

interface SchemaItemDto {
  id: string
  params: SchemaParamDto[]
  type: string
}

interface SchemaConstructorDto extends SchemaItemDto {
  predicate: string
}

interface SchemaMethodDto extends SchemaItemDto {
  method: string
}

interface SchemaDto {
  constructors: SchemaConstructorDto[]
  methods: SchemaMethodDto[]
}

export const parseSchema = (schema: SchemaDto): TgUserApiSchema => {
  return {
    constructors: parseSchemaConstructors(schema.constructors),
    methods: parseSchemaMethods(schema.methods),
  }
}

const excludedPredicates = [
  'boolFalse',
  'boolTrue',
  'true',
  'null',
  'vector',
]

const parseSchemaConstructors = (constructors: SchemaConstructorDto[]): TgUserApiSchemaConstructor[] => constructors
  .filter(({predicate}) => !excludedPredicates.includes(predicate))
  .map((it) => ({
    description: '',
    params: parseSchemaParams(it.params),
    predicate: it.predicate,
    typeName: parseSchemaTypeName(`predicate_${it.predicate}`).typeName,
    groupTypeName: parseSchemaTypeName(it.type).typeName,
    link: basePath + '/constructor/' + it.predicate,
  }))

const parseSchemaMethods = (methods: SchemaMethodDto[]): TgUserApiSchemaMethod[] => methods
  .map((method) => ({
    description: '',
    method: method.method,
    params: parseSchemaParams(method.params),
    methodName: parseSchemaTypeName(method.method, false).typeName,
    returnTypeName: parseSchemaTypeName(method.type).typeName,
    link: basePath + '/method/' + method.method,
  }))

const parseSchemaParams = (params: SchemaParamDto[]): TgUserApiSchemaParam[] => params
  .filter(({type}) => type !== '#')
  .map((param) => {
    const {
      isMaybe,
      typeName,
    } = parseSchemaTypeName(param.type)

    return {
      description: '',
      isMaybe,
      propName: param.name,
      typeName,
    }
  })

const BaseTypeByName: Record<string, string> = {
  int: 'number',
  long: 'string',
  double: 'number',
  bytes: 'Uint8Array',
  string: 'string',
  null: 'undefined',
  true: 'true',
  bool: 'boolean',
  x: 'unknown',
  '!x': 'unknown',
}

export const parseSchemaTypeName = (type: string, isUpperFirstChar = true) => {
  const [, flagNum, flagType] = type.match(/^flags([0-9]+)?.[0-9]+\?(.*)/) ?? []
  const [, vectorType] = type.match(/Vector<(.+)>/) ?? []
  const isFlag = Boolean(flagType)
  const isVector = Boolean(vectorType)
  const isMaybe = isFlag
  const tmpType = vectorType || flagType || type
  const baseType = BaseTypeByName[tmpType.toLowerCase()]
  let typeName: string

  typeName = baseType ?? tmpType
  typeName = camelCase(
    typeName.replace(/([a-z])\.([a-z])/gsui, '$1_$2'),
  )
  typeName = isVector ? `${typeName}[]` : typeName

  if (isUpperFirstChar && !baseType) {
    typeName = `${typeName.slice(0, 1).toUpperCase()}${typeName.slice(1)}`
  }

  return {
    isMaybe,
    typeName,
  }
}
