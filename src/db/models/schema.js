import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: 'patients',
      columns: [
        { name: 'first_name', type: 'string' },
        { name: 'last_name', type: 'string' }
      ]
    }),
  ]
})
