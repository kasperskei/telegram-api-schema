export interface TgUserApiSchemaParam {
  description: string
  isMaybe: boolean
  propName: string
  typeName: string
}
export interface TgUserApiSchemaConstructor {
  description: string
  params: TgUserApiSchemaParam[]
  predicate: string
  typeName: string
  groupTypeName: string
  link: string
}
export interface TgUserApiSchemaMethod {
  description: string
  params: TgUserApiSchemaParam[]
  method: string
  methodName: string
  returnTypeName: string
  link: string
}
export interface TgUserApiSchema {
  constructors: TgUserApiSchemaConstructor[]
  methods: TgUserApiSchemaMethod[]
}
