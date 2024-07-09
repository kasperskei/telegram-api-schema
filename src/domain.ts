export interface Schema {
  constructors: SchemaConstructor[]
  methods: SchemaMethod[]
}

export interface SchemaConstructor {
  description: string
  groupTypeName: string
  name: string
  params: SchemaParam[]
  source: string
  typeName: string
}

export interface SchemaMethod {
  description: string
  name: string
  params: SchemaParam[]
  returnTypeName: string
  source: string
  typeName: string
}

export interface SchemaParam {
  description: string
  isOptional: boolean
  name: string
  typeName: string
}
