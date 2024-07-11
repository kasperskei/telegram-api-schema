export const splitWords = (value: string): string[] => value
  .replaceAll(/([a-z])([A-Z])/gu, '$1 $2')
  .split(/[\b\s_-]+/gu)
