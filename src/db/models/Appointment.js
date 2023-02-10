import { Model } from '@nozbe/watermelondb'
import { text, field, relation, date, writer, lazy, children } from '@nozbe/watermelondb/decorators'
import { getAppointmentStatus } from '../../utils/getAppointmentStatus'
import { Q } from '@nozbe/watermelondb'
import { defaultUpdater } from '../../utils/defaultFn'
import { APPOINTMENT_STATUS } from '../../consts'
import { getTeethWithNoHistory, updateTeethState } from '../raw-queries'

export default class Appointment extends Model {
  static table = 'appointments'

  static associations = {
    patients: { type: 'belongs_to', key: 'patient_id' },
    appointments_teeth: { type: 'has_many', foreignKey: 'appointment_id' }
  }

  @text('patient_id') patientId
  @date('date') date
  @field('is_confirmed') isConfirmed
  @field('is_skipped') isSkipped
  @field('is_postponed') isPostponed
  @field('price') price
  @field('duration') duration
  @text('diagnosis') diagnosis
  @text('notes') notes
  @text('teeth') teeth
  @text('_status') _status
  @children('appointments_teeth') associatedRecords

  @lazy patientTeeth = this.collections.get('teeth').query(
    Q.on('formulas', 'patient_id', this.patientId),
  )
  
  @lazy teethInstances = this.collections
    .get('teeth')
    .query(Q.on('appointments_teeth', 'appointment_id', this.id))
  
  @lazy teethInstancesWithCount = this.collections
    .get('teeth')
    .query(
      Q.on('appointments_teeth', 'appointment_id', this.id),
      Q.unsafeSqlExpr(`(SELECT count(*) FROM appointments_teeth WHERE teeth.id = appointments_teeth.tooth_id) = 1`)
    )

  @relation('patients', 'patient_id') patient

  get status() {
    return getAppointmentStatus(this) 
  }

  needsConfimation(statusStr) {
    const status = statusStr || this.status
    return !this.isConfirmed && (status === APPOINTMENT_STATUS.lasts || status === APPOINTMENT_STATUS.past)
  }

  @writer async cleanUp() {
    if(this.isConfirmed && this.teeth) {
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

  @writer async deleteInstance() {
     this.callWriter(async () => await this.cleanUp())
     await this.markAsDeleted()
  }

  @writer async updateInstance(fields, teeth) {

    delete fields.teeth

    if(!teeth) {
      return await this.update(defaultUpdater(fields))
    }
    
    this.callWriter(async () => await this.cleanUp())

    const [existedTeeth, [formulaId] ] = await Promise.all([
      await this.patientTeeth.fetch(),
      await this.collections.get('formulas').query(
        Q.where('patient_id', this.patientId)
      ).fetchIds()
    ])

    const dict = existedTeeth.reduce((acc, dbTooth) => {
      acc[dbTooth.toothNo] = dbTooth
      return acc
    }, {})

    const batches = teeth.filter(Boolean).reduce((acc, tooth) => {
      if(dict[tooth]) {
        acc.push(this.collections.get('appointments_teeth').prepareCreate(instance => {
          instance.toothId = dict[tooth].id
          instance.appointmentId = this.id
        }))
        if(!dict[tooth].isTreated) {
          acc.push(dict[tooth].prepareUpdate((instance) => {
            instance.isTreated = true
          }))
        }
      } else {
        let newToothId

        acc.push(this.collections.get('teeth').prepareCreate(instance => {
          instance.toothNo = tooth
          instance.formulaId = formulaId
          instance.isTreated = true

          newToothId = instance.id
        }))

        acc.push(this.collections.get('appointments_teeth').prepareCreate(instance => {
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
