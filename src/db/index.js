import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import schema from './migrations/schema'
import migrations from './migrations/migrations'
import modelClasses from './models'

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'dental_app_v2',
  jsi: true,
  //migrations,
  onSetUpError: error => {
    // Database failed to load -- offer the user to reload the app or log out
  }
})

const database = new Database({
  adapter,
  modelClasses,
})

export default database
