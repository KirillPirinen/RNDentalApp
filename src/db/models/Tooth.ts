import { Model, Query } from '@nozbe/watermelondb'
import { text, writer, lazy, children, field } from '@nozbe/watermelondb/decorators'
import { defaultUpdater } from '../../utils/defaultFn'
import { Q } from '@nozbe/watermelondb'
import AppointmentTooth from './AppointmentTooth'
import Appointment from './Appointment'

export default class Tooth extends Model {
  static table = 'teeth'

  static associations = {
    formulas: { type: 'belongs_to', key: 'formula_id' },
    appointments_teeth: { type: 'has_many', foreignKey: 'tooth_id' },
  } as const
  
  @text('formula_id') formulaId: string
  @text('tooth_no') toothNo: string
  @text('tooth_state') toothState: string
  @text('notes') notes: string | null
  @field('is_treated') isTreated: boolean | null
  @children('appointments_teeth') associatedRecords: Query<AppointmentTooth>

  @lazy allAppointments = this.collections.get<Appointment>('appointments')
    .query(Q.on('appointments_teeth', 'tooth_id', this.id))

  @writer async updateInstance(fields: object) {
    await this.update(defaultUpdater(fields))
  }

  @writer async deleteInstance() {
    //await this.appointments.destroyAllPermanently()
    return await this.markAsDeleted()
  }

}
