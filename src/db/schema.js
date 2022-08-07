import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
  version: 7,
  tables: [
    tableSchema({
      name: 'patients',
      columns: [
        { name: 'first_name', type: 'string' },
        { name: 'last_name', type: 'string' },
        { name: 'phone', type: 'string' }
      ]
    }),
    tableSchema({
      name: 'appointments',
      columns: [
        { name: 'patient_id', type: 'string' },
        { name: 'date', type: 'number' },
        { name: 'is_confirmed', type: 'boolean' },
        { name: 'is_skipped', type: 'boolean' },
        { name: 'is_postponed', type: 'boolean' },
        { name: 'duration', type: 'number' },
        { name: 'price', type: 'number', isOptional: true },
        { name: 'diagnosis', type: 'string', isOptional: true },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'teeth', type: 'string', isOptional: true }
      ]
    }),
  ]
})
