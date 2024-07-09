import {
  splitWords,
} from './split-words.ts'

export const kebabCase = (value: string): string => splitWords(value)
  .join('-')
  .toLowerCase()
