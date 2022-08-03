import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'patients',
      columns: [
        { name: 'firstName', type: 'string' },
        { name: 'lastName', type: 'string' }
      ]
    }),
  ]
})
