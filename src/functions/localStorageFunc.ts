export const localSetItem = (key: string, val: string): void => {
  localStorage.setItem(key, val)
}

export const localGetItem = (key: string): string | any => {
  return localStorage.getItem(key)
}