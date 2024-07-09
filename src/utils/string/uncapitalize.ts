export const uncapitalize = <T extends string>(value: T): Uncapitalize<T> => (value.charAt(0).toLowerCase() + value.slice(1)) as Uncapitalize<T>
