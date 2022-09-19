import { Model } from '@nozbe/watermelondb'
import { text, field, relation, date, writer, lazy, children } from '@nozbe/watermelondb/decorators'
import { getAppointmentStatus } from '../../utils/getAppointmentStatus'
import { Q } from '@nozbe/watermelondb'
import { defaultUpdater } from '../../utils/defaultFn'
import { APPOINTMENT_STATUS } from '../../utils/constants'

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
    Q.on('formulas', 'patient_id', this.patientId)
  )

  @lazy teethInstances = this.collections
    .get('teeth')
    .query(Q.on('appointments_teeth', 'appointment_id', this.id))

  @relation('patients', 'patient_id') patient

  get status() {
    return getAppointmentStatus(this) 
  }

  needsConfimation(statusStr) {
    const status = statusStr || this.status
    return !this.isConfirmed && status === APPOINTMENT_STATUS.lasts || status === APPOINTMENT_STATUS.past
  }

  @writer async deleteInstance() {
     await this.markAsDeleted()
  }

  @writer async updateInstance(fields, teeth) {

    delete fields.teeth

    if(!teeth) {
      return await this.update(defaultUpdater(fields))
    }

    //clean before Add
    await this.associatedRecords.destroyAllPermanently()

    const existedTeeth = await this.patientTeeth.fetch()
    const formula = await this.collections.get('formulas').query(
      Q.where('patient_id', this.patientId)
    ).fetch()

    const dict = existedTeeth.reduce((acc, dbTooth) => {
      acc[dbTooth.toothNo] = dbTooth.id
      return acc
    }, {})

    const batches = teeth.reduce((acc, teeth) => {
      if(dict[teeth]) {
        acc.push(this.collections.get('appointments_teeth').prepareCreate(instance => {
          instance.toothId = dict[teeth]
          instance.appointmentId = this.id
        }))
      } else {
        acc.push(this.collections.get('teeth').prepareCreate(instance => {
          instance.teethNo = teeth
          instance.formulaId = formula[0].id

          acc.push(this.collections.get('appointments_teeth').prepareCreate(instance => {
            instance.toothId = instance.id
            instance.appointmentId = this.id
          }))
          
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
