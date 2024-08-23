export type Routine = {
  id?: number,
  content: string,
  // Dexie.jsではbooleanが使いづらいから
  // 0, 1で管理する
  // チェックボックスで管理
  done: number
}