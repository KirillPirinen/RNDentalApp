import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import schema from './schema'
import migrations from './migrations/migrations'
import modelClasses from './models'

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'dental',
  jsi: false,
  //migrations,
  onSetUpError: error => {
    // Database failed to load -- offer the user to reload the app or log out
  }
})

export const database = new Database({
  adapter,
  modelClasses,
})
