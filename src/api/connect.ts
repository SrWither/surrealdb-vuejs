import { Surreal } from 'surrealdb.js'

export const db = new Surreal()

export const initDB = async () => {
  await db.connect('http://127.0.0.1:8000/rpc', {
    namespace: 'blog',
    database: 'blog'
  })
}
