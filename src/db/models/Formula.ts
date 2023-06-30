import { Model, Query } from '@nozbe/watermelondb'
import { text, field, writer, children } from '@nozbe/watermelondb/decorators'
import { defaultUpdater } from '../../utils/defaultFn'
import Tooth from './Tooth'

export default class Formula extends Model {
  static table = 'formulas'

  static associations = {
    patients: { type: 'belongs_to', key: 'patient_id' },
    teeth: { type: 'has_many', foreignKey: 'formula_id' },
  } as const
  
  @text('patient_id') patientId: string
  @field('has_baby_jaw') hasBabyJaw: boolean
  @field('has_adult_jaw') hasAdultJaw: boolean
  @children('teeth') teeth: Query<Tooth>

  @writer async updateInstance(fields: object) {
    await this.update(defaultUpdater(fields))
  }

  @writer async deleteInstance() {
    return await this.markAsDeleted()
  }

}
