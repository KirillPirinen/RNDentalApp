import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
  version: 6,
  tables: [
    tableSchema({
      name: 'patients',
      columns: [
        { name: 'full_name', type: 'string' },
        { name: 'has_telegram', type: 'boolean' },
        { name: 'has_whatsapp', type: 'boolean' },
        { name: 'contact_id', type: 'string', isOptional: true }
      ]
    }),
    tableSchema({
      name: 'phones',
      columns: [
        { name: 'patient_id', type: 'string', isIndexed: true },
        { name: 'is_primary', type: 'boolean' },
        { name: 'number', type: 'string' },
      ]
    }),
    tableSchema({
      name: 'appointments',
      columns: [
        { name: 'patient_id', type: 'string', isIndexed: true },
        { name: 'date', type: 'number' },
        { name: 'is_confirmed', type: 'boolean' },
        { name: 'is_skipped', type: 'boolean' },
        { name: 'is_postponed', type: 'boolean' },
        { name: 'duration', type: 'number' },
        { name: 'price', type: 'number', isOptional: true },
        { name: 'diagnosis', type: 'string', isOptional: true },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'teeth', type: 'string', isOptional: true }
      ],
      unsafeSql: sql => {
        console.log(sql)
        return sql
      }
    }),
    tableSchema({
      name: 'teeth',
      columns: [
        { name: 'formula_id', type: 'string', isIndexed: true },
        { name: 'tooth_no', type: 'string' },
        { name: 'tooth_state', type: 'string' },
        { name: 'notes', type: 'string', isOptional: true },
      ]
    }),
    tableSchema({
      name: 'formulas',
      columns: [
        { name: 'patient_id', type: 'string', isIndexed: true },
        { name: 'has_baby_jaw', type: 'boolean' },
        { name: 'has_adult_jaw', type: 'boolean' }
      ]
    }),
    tableSchema({
      name: 'templates',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'text', type: 'string' }
      ]
    }),
    tableSchema({
      name: 'appointments_teeth',
      columns: [
        { name: 'appointment_id', type: 'string' },
        { name: 'tooth_id', type: 'string' }
      ]
    }),
  ]
})
