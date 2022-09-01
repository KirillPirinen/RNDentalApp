import { Model } from '@nozbe/watermelondb'
import { text, field, writer, children } from '@nozbe/watermelondb/decorators'

export default class Formula extends Model {
  static table = 'formulas'

  static associations = {
    patients: { type: 'belongs_to', key: 'patient_id' },
    teeth: { type: 'has_many', foreignKey: 'formula_id' },
  }
  
  @text('patient_id') patientId
  @field('has_baby_jaw') hasBabyJaw
  @field('has_adult_jaw') hasAdultJaw
  @children('teeth') teeth

  @writer async updateInstance(fields) {
    await this.update(instance => {
        Object.keys(fields).forEach((key) => {
          instance[key] = fields[key]
        })
    })
  }

  @writer async deleteInstance() {
    await this.appointments.destroyAllPermanently()
    return await this.markAsDeleted()
  }

}
