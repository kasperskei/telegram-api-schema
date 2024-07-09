import {
  splitWords,
} from './split-words.ts'

export const snakeCase = (value: string): string => splitWords(value)
  .join('_')
  .toLowerCase()
