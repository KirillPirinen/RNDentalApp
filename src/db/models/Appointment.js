import { Model } from '@nozbe/watermelondb'
import { text, field, relation, date, writer, lazy } from '@nozbe/watermelondb/decorators'
import { getAppointmentStatus } from '../../utils/getAppointmentStatus'
import { Q } from '@nozbe/watermelondb'

export default class Appointment extends Model {
  static table = 'appointments'

  static associations = {
    patients: { type: 'belongs_to', key: 'patient_id' },
    appointments_teeth: { type: 'has_many', foreignKey:'tooth_id' }
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

  @lazy teethInstances = this.collections
    .get('teeth')
    .query(Q.on('appointments_teeth', 'appointment_id', this.id))

  @relation('patients', 'patient_id') patient

  get status() {
    return getAppointmentStatus(this) 
  }

  @writer async deleteInstance() {
    return await this.markAsDeleted()
  }

  @writer async updateInstance(fields) {
    await this.update(instance => {
        Object.keys(fields).forEach((key) => {
          instance[key] = fields[key]
        })
    })
  }

}


