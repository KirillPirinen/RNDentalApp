import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import schema from './migrations/schema'
import migrations from './migrations/migrations'
import modelClasses from './models'
import { appConfigAsync } from '../consts/config'

const adapter = appConfigAsync.then((config) => {
  return new SQLiteAdapter({
    schema,
    dbName: config.dbPath,
    jsi: true,
    migrations
    // onSetUpError: error => {
    //   // Database failed to load -- offer the user to reload the app or log out
    // }
  })
})

let database: Database | undefined

export const dbAsync = (async () => {

  database = new Database({
    adapter: await adapter,
    modelClasses
  })

  return database
})()

const getDatabase = () => {
  if(!database) throw new Error('db not initialized')
  return database
}

export default getDatabase
