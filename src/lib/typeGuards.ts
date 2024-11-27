export function isValidKey<T extends {}>(
  key: string,
): key is Extract<keyof T, string> {
  return key in ({} as T)
}
