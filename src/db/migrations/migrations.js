import { schemaMigrations, createTable, unsafeExecuteSql, addColumns } from '@nozbe/watermelondb/Schema/migrations'

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        unsafeExecuteSql(
          'drop table patients;'
        ),
        createTable({
          name: 'patients',
          columns: [
            { name: 'first_name', type: 'string' },
            { name: 'last_name', type: 'string' }
          ]
        }),
      ],
    },
    {
      toVersion: 3,
      steps: [
        unsafeExecuteSql(
          'drop table patients;'
        ),
        createTable({
          name: 'patients',
          columns: [
            { name: 'first_name', type: 'string' },
            { name: 'last_name', type: 'string' }
          ]
        }),
      ],
    },
    {
      toVersion: 4,
      steps: [
        addColumns({
          table: 'patients',
          columns: [
            { name: 'phone', type: 'string' }
          ]
        })
      ]
    },
    {
      toVersion: 5,
      steps: [
        createTable({
          name: 'appointments',
          columns: [
            { name: 'patient_id', type: 'string' },
            { name: 'date', type: 'number' },
            { name: 'is_confirmed', type: 'boolean' },
            { name: 'is_skipped', type: 'boolean' },
            { name: 'is_postponed', type: 'boolean' },
            { name: 'price', type: 'number' },
            { name: 'diagnosis', type: 'string', isOptional: true },
            { name: 'notes', type: 'string', isOptional: true },
            { name: 'teeth', type: 'string', isOptional: true }
          ]
        })
      ]
    },
    {
      toVersion: 6,
      steps: [
        unsafeExecuteSql(
          'drop table appointments;'
        ),
        createTable({
          name: 'appointments',
          columns: [
            { name: 'patient_id', type: 'string' },
            { name: 'date', type: 'number' },
            { name: 'is_confirmed', type: 'boolean' },
            { name: 'is_skipped', type: 'boolean' },
            { name: 'is_postponed', type: 'boolean' },
            { name: 'price', type: 'number', isOptional: true },
            { name: 'diagnosis', type: 'string', isOptional: true },
            { name: 'notes', type: 'string', isOptional: true },
            { name: 'teeth', type: 'string', isOptional: true }
          ]
        })
      ]
    }
  ],
})
