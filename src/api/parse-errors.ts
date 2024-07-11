import {
  pascalCase,
} from '@/utils/string/pascal-case.ts'
import {
  type SchemaError,
} from '@/domain.ts'

interface ErrorsDto {
  errors: Record<number, Record<string, string[]>>
  descriptions: Record<string, string>
  user_only: string[]
  bot_only: string[]
}

export const parseErrors = (errorsDto: ErrorsDto): SchemaError[] => {
  /**
   * В исходной схеме нет этой ошибки.
   * @todo Добавить остальные методы.
   */
  errorsDto.errors[401] ??= {}
  errorsDto.errors[401]['SESSION_PASSWORD_NEEDED'] ??= [
    'updates.getState',
    'auth.signIn',
    'auth.exportLoginToken',
  ]

  const errors = Object.entries(errorsDto.errors)
    .flatMap(([code, names]) => Object.entries(names)
      .map<SchemaError>(([name, methods]) => ({
        code: parseInt(code),
        name: name.replace('%d', '${string}').replace('_*', ''),
        typeName: 'Error' + pascalCase(name.replace('_%d', '_dynamic').replace('_*', '').toLowerCase()) + code.replace('-', '_'),
        methods,
        description: errorsDto.descriptions[name]!,
      })))

  return errors
}
