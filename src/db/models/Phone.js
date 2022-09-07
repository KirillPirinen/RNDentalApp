import { Model } from '@nozbe/watermelondb'
import { text, field, writer, children } from '@nozbe/watermelondb/decorators'

export default class Phone extends Model {
  static table = 'phones'

  static associations = {
    patients: { type: 'belongs_to', key: 'patient_id' },
  }
  
  @text('patient_id') patientId
  @field('is_primary') isPrimary
  @text('number') number

  @writer async markAsPrime(numbersToOff) {

    const batchPhones = numbersToOff?.map(phone => {
      return phone.prepareUpdate(instance => {
        instance.isPrimary = false
      })
    })

    await await this.batch(
      this.prepareUpdate(instance => {
        instance.isPrimary = true
      }),
      ...batchPhones
    )
  }

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
