import { Surreal } from 'surrealdb.js'

export const db = new Surreal()
const dbUrl: string = import.meta.env.VITE_SURREALDB

export const initDB = async () => {
  await db.connect(dbUrl, {
    namespace: 'blog',
    database: 'blog'
  })
}
