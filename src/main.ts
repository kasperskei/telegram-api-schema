import {
  getHtmlPage,
  getSchema,
} from '@/api/index.ts'
import {
  type TgUserApiSchema,
} from '@/schemaGenerator/types/TgUserApiSchema.ts'

const writeSchema = async () => {
  const schema = await getSchema()

  await Promise.all([
    ...schema.constructors.map(async (constructor) => {
      const {description, params} = await getHtmlPage(constructor.link)

      constructor.description = description
      constructor.params.forEach((param) => {
        param.description = params[param.propName] ?? ''
      })
    }),
    ...schema.methods.map(async (method) => {
      const {description, params} = await getHtmlPage(method.link)

      method.description = description
      method.params.forEach((param) => {
        param.description = params[param.propName] ?? ''
      })
    }),
  ])

  await Bun.write(
    './lib/schema.json',
    JSON.stringify(schema, undefined, 2),
  )

  return schema
}

const writeTypes = async (schema: TgUserApiSchema) => {
  const tab = '  '
  const tabbed = (rows: string[]): string[] => rows.map((row) => tab + row)

  const constructorType = [
    'export type Constructor =',
    ...tabbed(schema.constructors.map((constructor) => '| ' + constructor.typeName)),
  ].join('\n')

  const constructorMapType = [
    'export interface ConstructorMap {',
    ...tabbed(schema.constructors.map((constructor) => `'${constructor.predicate}': ${constructor.typeName}`)),
    '}',
  ].join('\n')

  const constructorsTypes = schema.constructors
    .map((constructor) => {
      return [
        `/**`,
        ` * ${constructor.description}`,
        ` * @see ${constructor.link}`,
        ` */`,
        `export interface ${constructor.typeName} {`,
        ...tabbed([
          `_: '${constructor.predicate}'`,
          ...constructor.params.flatMap((param) => [
            `/** ${param.description} */`,
            `${param.propName}${param.isMaybe ? '?' : ''}: ${param.typeName}`,
          ]),
        ]),
        `}`,
      ].join('\n')
    }).join('\n\n')

  const groupConstructorsTypes = Object.entries(Object.groupBy(schema.constructors, (constructor) => constructor.groupTypeName))
    .map(([groupTypeName, constructors]) => [
      `export type ${groupTypeName} =`,
      ...tabbed(constructors!.map((it) => '| ' + it.typeName)),
    ].join('\n')).join('\n\n')

  const methodType = [
    'export type Method =',
    ...tabbed(schema.methods.map((method) => '| ' + method.methodName)),
  ].join('\n')

  const methodReturnMapType = [
    'export interface MethodReturnMap {',
    ...tabbed(schema.methods.map((method) => `'${method.method}': ${method.returnTypeName}`)),
    '}',
  ].join('\n')

  // const methodMapType = 'export interface MethodMap {' + schema.methods.map((method) => `\n${tab}'${method.method}': ${method.methodName}`).join('') + '\n}'

  const methodsTypes = schema.methods
    .map((method) => {
      return [
        `/**`,
        ` * ${method.description}`,
        ` * @see ${method.link}`,
        ` */`,
        `export interface ${method.methodName} {`,
        `${tab}_: '${method.method}'`,
        ...method.params.flatMap((param) => [
          `/** ${param.description} */`,
          `${param.propName}${param.isMaybe ? '?' : ''}: ${param.typeName}`,
        ]).map((row) => tab + row),
        `}`,
      ].join(`\n`)
    }).join(`\n\n`)

  const createMethodType = [
    'export interface CreateMethod {',
    tabbed(schema.methods.flatMap((method) => [
      `/**`,
      ` * ${method.description}`,
      ` * @see ${method.link}`,
      ` */`,
      `(method: '${method.method}'): (params: ${method.methodName}) => Promise<${method.returnTypeName}>`,
    ])),
    '}',
  ].flat().join('\n')

  // const executeMethodType = [
  //   'export interface ExecuteMethod {',
  //   ...tabbed(schema.methods.flatMap((method) => [
  //     `/**`,
  //     ` * ${method.description}`,
  //     ` * @see ${method.link}`,
  //     ` */`,
  //     `(method: ${method.methodName}): Promise<${method.returnTypeName}>`,
  //     // `(method: {_: '${method.method}'} & ${method.methodName}): Promise<${method.returnTypeName}>`,
  //   ])),
  //   '}',
  // ].join('\n')

  const executeMethodType = `export type ExecuteMethod = <T extends Method>(method: T) => MethodReturnMap[T['_']]`

  const result = [
    constructorType,
    constructorMapType,
    constructorsTypes,
    groupConstructorsTypes,
    methodType,
    // methodMapType,
    methodReturnMapType,
    methodsTypes,
    createMethodType,
    executeMethodType,
  ].join('\n\n')

  await Bun.write(
    './lib/schema.ts',
    result,
  )
}

const main = async () => {
  const schema = await writeSchema()
  await writeTypes(schema)
}

await main()
