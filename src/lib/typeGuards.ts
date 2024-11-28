export function isKeyOfObject<T extends {}>(
  key: string,
  object: T,
): key is Extract<keyof T, string> {
  return object[key as keyof T] !== undefined
}