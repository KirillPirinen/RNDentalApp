import { Model, Query } from '@nozbe/watermelondb'
import { immutableRelation, text } from '@nozbe/watermelondb/decorators'
import Tooth from './Tooth';
import Appointment from './Appointment';

export default class AppointmentTooth extends Model {
  static table = 'appointments_teeth'

  static associations = {
    teeth: { type: 'belongs_to', key: 'tooth_id' },
    appointments: { type: 'belongs_to', key: 'appointment_id' },
  } as const

  @text('tooth_id') toothId: string;
  @text('appointment_id') appointmentId: string

  @immutableRelation('teeth', 'tooth_id') tooth: Query<Tooth>
  @immutableRelation('appointments', 'appointment_id') appointment: Query<Appointment>

}
