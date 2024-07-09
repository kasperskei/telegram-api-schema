import {
  splitWords,
} from './split-words.ts'
import {
  capitalize,
} from './capitalize.ts'

export const pascalCase = (value: string): string => splitWords(value)
  .map((word) => capitalize(word))
  .join('')
