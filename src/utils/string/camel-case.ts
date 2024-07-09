import {
  splitWords,
} from './split-words.ts'
import {
  capitalize,
} from './capitalize.ts'
import {
  uncapitalize,
} from './uncapitalize.ts'

export const camelCase = (value: string): string => uncapitalize(splitWords(value)
  .map((word) => capitalize(word))
  .join(''))
