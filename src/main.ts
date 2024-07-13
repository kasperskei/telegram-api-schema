import {
  Schema,
} from '@/domain.ts'
import {
  getErrors,
  getHtmlPage,
  getSchema,
} from '@/api/index.ts'

const main = async () => {
  const schema = await buildSchema()
  const types = await buildTypes(schema)
  await Promise.all([
    writeSchema(schema),
    writeTypes(types),
  ])
}

const buildSchema = async () => {
  const [schema, errors] = await Promise.all([
    getSchema(),
    getErrors(),
  ])

  schema.errors = errors

  errors.forEach((error) => {
    schema.methods.forEach((method) => {
      if (error.methods.includes(method.name)) {
        method.returnTypeName += ' | ' + error.typeName
      }
    })
  })

  await Promise.all([
    ...schema.constructors.map(async (constructor) => {
      const {description, params} = await getHtmlPage(constructor.source)

      constructor.description = description
      constructor.params.forEach((param) => {
        param.description = params[param.name] ?? ''
      })
    }),
    ...schema.methods.map(async (method) => {
      const {description, params} = await getHtmlPage(method.source)

      method.description = description
      method.params.forEach((param) => {
        param.description = params[param.name] ?? ''
      })
    }),
  ])

  return schema
}

const writeSchema = async (schema: Schema) => {
  await Bun.write(
    './lib/schema.json',
    JSON.stringify(schema, undefined, 2),
  )
}

const buildTypes = async (schema: Schema) => {
  const tab = '  '
  const tabbed = (rows: string[]): string[] => rows.map((row) => tab + row)
  const compare = (left: string, right: string): number => left.localeCompare(right)
  const sort = (rows: string[]): string[] => rows.sort(compare)

  const constructorType = [
    'export type Constructor =',
    ...tabbed(sort(schema.constructors.map((constructor) => '| ' + constructor.typeName))),
  ].join('\n')

  const constructorMapType = [
    'export interface ConstructorMap {',
    ...tabbed(sort(schema.constructors.map((constructor) => `'${constructor.name}': ${constructor.typeName}`))),
    '}',
  ].join('\n')

  const constructorsTypes = schema.constructors
    .sort((left, right) => compare(left.typeName, right.typeName))
    .map((constructor) => {
      return [
        `/**`,
        ` * ${constructor.description}`,
        ` * @see ${constructor.source}`,
        ` */`,
        `export interface ${constructor.typeName} {`,
        ...tabbed([
          `_: '${constructor.name}'`,
          ...constructor.params.sort((left, right) => compare(left.name, right.name)).flatMap((param) => [
            `/** ${param.description} */`,
            `${param.name}${param.isOptional ? '?' : ''}: ${param.typeName}`,
          ]),
        ]),
        `}`,
      ].join('\n')
    }).join('\n\n')

  const groupConstructorsTypes = Object.entries(Object.groupBy(schema.constructors, (constructor) => constructor.groupTypeName))
    .map(([groupTypeName, constructors]) => [
      `export type ${groupTypeName} =`,
      ...tabbed(sort(constructors!.map((it) => '| ' + it.typeName))),
    ].join('\n')).join('\n\n')

  const errorBaseType = [
    'export interface ErrorBase {',
    ...tabbed([
      `_: 'mt_rpc_error'`,
      `error_code: number`,
      `error_message: string`,
    ]),
    '}',
  ].join('\n')

  const errorsTypes = schema.errors
    .sort((left, right) => compare(left.typeName, right.typeName))
    .map((error) => {
      return [
        `/**`,
        ` * ${error.description}`,
        ` */`,
        `export interface ${error.typeName} extends ErrorBase {`,
        ...tabbed([
          `error_code: ${error.code}`,
          `error_message: \`${error.name}\``,
        ]),
        `}`,
      ].join('\n')
    }).join('\n\n')

  const methodType = [
    'export type Method =',
    ...tabbed(sort(schema.methods.map((method) => '| ' + method.typeName))),
  ].join('\n')

  const methodReturnMapType = [
    'export interface MethodReturnMap {',
    ...tabbed(sort(schema.methods.map((method) => `'${method.name}': ${method.returnTypeName}`))),
    '}',
  ].join('\n')

  // const methodMapType = 'export interface MethodMap {' + schema.methods.map((method) => `\n${tab}'${method.method}': ${method.typeName}`).join('') + '\n}'

  const methodsTypes = schema.methods
    .sort((left, right) => compare(left.typeName, right.typeName))
    .map((method) => {
      return [
        `/**`,
        ` * ${method.description}`,
        ` * @see ${method.source}`,
        ` */`,
        `export interface ${method.typeName} {`,
        ...tabbed([
          `_: '${method.name}'`,
          ...method.params.sort((left, right) => compare(left.name, right.name)).flatMap((param) => [
            `/** ${param.description} */`,
            `${param.name}${param.isOptional ? '?' : ''}: ${param.typeName}`,
          ]),
        ]),
        `}`,
      ].join(`\n`)
    }).join(`\n\n`)

  // const createMethodType = [
  //   'export interface CreateMethod {',
  //   tabbed(schema.methods.sort((left, right) => compare(left.name, right.name)).flatMap((method) => [
  //     `/**`,
  //     ` * ${method.description}`,
  //     ` * @see ${method.source}`,
  //     ` */`,
  //     `(method: '${method.name}'): (params: ${method.typeName}) => Promise<${method.returnTypeName}>`,
  //   ])),
  //   '}',
  // ].flat().join('\n')

  // const executeMethodType = [
  //   'export interface ExecuteMethod {',
  //   ...tabbed(schema.methods.flatMap((method) => [
  //     `/**`,
  //     ` * ${method.description}`,
  //     ` * @see ${method.link}`,
  //     ` */`,
  //     `(method: ${method.typeName}): Promise<${method.returnTypeName}>`,
  //     // `(method: {_: '${method.method}'} & ${method.typeName}): Promise<${method.returnTypeName}>`,
  //   ])),
  //   '}',
  // ].join('\n')

  const executeMethodType = `export type ExecuteMethod = <T extends Method>(method: T) => Promise<MethodReturnMap[T['_']]>`

  const types = [
    constructorType,
    constructorMapType,
    constructorsTypes,
    groupConstructorsTypes,
    errorBaseType,
    errorsTypes,
    methodType,
    // methodMapType,
    methodReturnMapType,
    methodsTypes,
    // createMethodType,
    executeMethodType,
  ].join('\n\n')

  return types
}

const writeTypes = async (types: string) => {
  await Bun.write(
    './lib/schema.ts',
    types,
  )
}

await main()
