import {
  pascalCase,
} from '@/utils/string/pascal-case.ts'
import {
  basePath,
} from '@/api/index.ts'
import {
  type Schema,
  type SchemaConstructor,
  type SchemaMethod,
  type SchemaParam,
} from '@/domain.ts'

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

export const parseSchema = (schema: SchemaDto): Schema => {
  return {
    constructors: parseSchemaConstructors(schema.constructors),
    errors: [],
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

const parseSchemaConstructors = (constructors: SchemaConstructorDto[]): SchemaConstructor[] => constructors
  .filter(({predicate}) => !excludedPredicates.includes(predicate))
  .map((it) => ({
    description: '',
    params: parseSchemaParams(it.params),
    name: it.predicate,
    typeName: parseSchemaTypeName('predicate_' + it.predicate).typeName,
    groupTypeName: parseSchemaTypeName(it.type).typeName,
    source: basePath + '/constructor/' + it.predicate,
  }))

const parseSchemaMethods = (methods: SchemaMethodDto[]): SchemaMethod[] => methods
  .map((method) => ({
    description: '',
    name: method.method,
    params: parseSchemaParams(method.params),
    returnTypeName: parseSchemaTypeName(method.type).typeName,
    source: basePath + '/method/' + method.method,
    typeName: parseSchemaTypeName(method.method).typeName,
  }))

const parseSchemaParams = (params: SchemaParamDto[]): SchemaParam[] => params
  .filter(({type}) => type !== '#')
  .map((param) => {
    const {
      isOptional,
      typeName,
    } = parseSchemaTypeName(param.type)

    return {
      description: '',
      isOptional,
      name: param.name,
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

const parseSchemaTypeName = (type: string) => {
  const [, flagNum, flagType] = type.match(/^flags([0-9]+)?.[0-9]+\?(.*)/) ?? []
  const [, vectorType] = type.match(/Vector<(.+)>/) ?? []

  const isFlag = Boolean(flagType)
  const isVector = Boolean(vectorType)
  const isOptional = isFlag

  const tmpType = vectorType || flagType || type
  const baseType = BaseTypeByName[tmpType.toLowerCase()]

  let typeName = (baseType ?? tmpType).split('.').join('_')
  typeName = !baseType ? pascalCase(typeName) : typeName
  typeName = isVector ? typeName + '[]' : typeName

  return {
    isOptional,
    typeName,
  }
}
