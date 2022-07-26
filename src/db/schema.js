import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
  version: 10,
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
    tableSchema({
      name: 'teeth',
      columns: [
        { name: 'formula_id', type: 'string' },
        { name: 'tooth_no', type: 'string' },
        { name: 'tooth_state', type: 'string' }
      ]
    }),
    tableSchema({
      name: 'formulas',
      columns: [
        { name: 'patient_id', type: 'string' },
        { name: 'has_baby_jaw', type: 'boolean' },
        { name: 'has_adult_jaw', type: 'boolean' }
      ]
    }),
  ]
})
