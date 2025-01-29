import { Model, Q, Query } from '@nozbe/watermelondb'
import { text, field, relation, date, writer, lazy, children, readonly } from '@nozbe/watermelondb/decorators'
import { getAppointmentStatus } from '../../utils/getAppointmentStatus'
import { defaultUpdater } from '../../utils/defaultFn'
import { APPOINTMENT_STATUS } from '../../consts'
import AppointmentTooth from './AppointmentTooth'
import Tooth from './Tooth'
import Patient from './Patient'
import { ModelStatus } from '../utils/types'

export default class Appointment extends Model {
  static table = 'appointments'

  static associations = {
    patients: { type: 'belongs_to', key: 'patient_id' },
    appointments_teeth: { type: 'has_many', foreignKey: 'appointment_id' }
  } as const

  @text('patient_id') patientId: string
  @date('date') date: Date
  @readonly @date('created_at') createdAt: Date
  @readonly @date('updated_at') updatedAt: Date
  @field('is_confirmed') isConfirmed: boolean
  @field('is_skipped') isSkipped: boolean
  @field('is_postponed') isPostponed: boolean
  @field('is_archive') isArchive: boolean
  @field('price') price: number
  @field('duration') duration: number
  @text('diagnosis') diagnosis: string
  @text('notes') notes: string
  @text('teeth') teeth: string
  @text('_status') _status: ModelStatus
  @children('appointments_teeth') associatedRecords: Query<AppointmentTooth>

  @lazy patientTeeth = this.collections.get<Tooth>('teeth').query(
     
    // @ts-ignore
    Q.on('formulas', 'patient_id', this.patientId)
  )

  @lazy teethInstances = this.collections
    .get<Tooth>('teeth')
    .query(Q.on('appointments_teeth', 'appointment_id', this.id))

  @lazy teethInstancesWithCount = this.collections
    .get<Tooth>('teeth')
    .query(
      Q.on('appointments_teeth', 'appointment_id', this.id),
      Q.unsafeSqlExpr('(SELECT count(*) FROM appointments_teeth WHERE teeth.id = appointments_teeth.tooth_id) = 1')
    )

  @relation('patients', 'patient_id') patient: Query<Patient>

  get status () {
    return getAppointmentStatus(this)
  }

  needsConfimation (statusStr: string) {
    const status = statusStr || this.status
    return !this.isConfirmed && (status === APPOINTMENT_STATUS.lasts || status === APPOINTMENT_STATUS.past)
  }

  @writer async cleanUp () {
    if (this.isConfirmed && this.teeth) {
      const [teethToReset, recordsToDelete] = await Promise.all([
        this.teethInstancesWithCount.fetch(),
        this.associatedRecords.fetch()
      ])
      const batches = teethToReset.map((tooth) => {
        return tooth.prepareUpdate(instance => {
          instance.isTreated = false
        })
      })
      const recordsBatch = recordsToDelete.map((record) => {
        return record.prepareDestroyPermanently()
      })

      await this.batch(...batches, ...recordsBatch)
    }
  }

  @writer async deleteInstance () {
    this.callWriter(async () => await this.cleanUp())
    await this.markAsDeleted()
  }

  @writer async updateInstance (fields: { [x: string]: any; teeth?: string }, teeth?: string[]) {

    delete fields.teeth

    if (!teeth) {
      return await this.update(defaultUpdater(fields))
    }

    this.callWriter(async () => await this.cleanUp())

    const [existedTeeth, [formulaId]] = await Promise.all([
      await this.patientTeeth.fetch(),
      await this.collections.get('formulas').query(
        Q.where('patient_id', this.patientId)
      ).fetchIds()
    ])

    const dict = existedTeeth.reduce<Record<string, Tooth>>((acc, dbTooth) => {
      acc[dbTooth.toothNo] = dbTooth
      return acc
    }, {})

    const batches = teeth.filter(Boolean).reduce<Model[]>((acc, tooth) => {
      if (dict[tooth]) {
        acc.push(this.collections.get<AppointmentTooth>('appointments_teeth').prepareCreate(instance => {
          instance.toothId = dict[tooth].id
          instance.appointmentId = this.id
        }))
        if (!dict[tooth].isTreated) {
          acc.push(dict[tooth].prepareUpdate((instance) => {
            instance.isTreated = true
          }))
        }
      } else {
        let newToothId: string

        acc.push(this.collections.get<Tooth>('teeth').prepareCreate(instance => {
          instance.toothNo = tooth
          instance.formulaId = formulaId
          instance.isTreated = true

          newToothId = instance.id
        }))

        acc.push(this.collections.get<AppointmentTooth>('appointments_teeth').prepareCreate(instance => {
          instance.toothId = newToothId
          instance.appointmentId = this.id
        }))
      }
      return acc
    }, [])

    fields.teeth = teeth.join(',')

    await this.batch(
      this.prepareUpdate(defaultUpdater(fields)),
      ...batches
    )
  }
}
