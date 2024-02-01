import { Surreal } from 'surrealdb.js'

export const db = new Surreal()

export const initDB = async () => {
  await db.connect('http://localhost:8000/rpc', {
    namespace: 'blog',
    database: 'blog'
  })
}
