import { Model } from '@nozbe/watermelondb'
import { text, writer, date, readonly } from '@nozbe/watermelondb/decorators'
import { defaultUpdater } from '../../utils/defaultFn'
import * as FileSystem from 'expo-file-system';
import { StorageAccessFramework } from 'expo-file-system'
import { mimeTypes } from '../../consts/index';

export default class File extends Model {
  static table = 'files'

  static associations = {
    patients: { type: 'belongs_to', key: 'patient_id' },
  } as const
  
  @text('patient_id') patientId: string
  @text('name') name: string
  @text('type') type: keyof typeof mimeTypes
  @readonly @date('created_at') createdAt: Date

  get uri() {
    return `${FileSystem.documentDirectory}${this.patientId}/${this.name}`
  }

  @writer async updateInstance(fields: object) {
    await this.update(defaultUpdater(fields))
  }

  @writer async deleteInstance() {
    try {
      await this.destroyPermanently()
      return await FileSystem.deleteAsync(this.uri, { idempotent: true })
    } catch (e) {
      console.log(e)
    }
  }

  async copyTo (directoryUri: string, fileNamePrefix = ''): Promise<FileMeta> {
    const fileName = fileNamePrefix + this.name
    const mimeType = mimeTypes[this.type]
    const base64 = await FileSystem.readAsStringAsync(this.uri, { encoding: FileSystem.EncodingType.Base64 })
    const newFileUri = await StorageAccessFramework.createFileAsync(directoryUri, fileName, mimeType)
    await StorageAccessFramework.writeAsStringAsync(newFileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
    return {
      id: this.id,
      originalName: this.name,
      fileName,
      mimeType,
      type: this.type,
      patientId: this.patientId
    }
  }
  
}

export type FileMeta = {
  id: string,
  originalName: string,
  fileName: string,
  mimeType: string,
  type: keyof typeof mimeTypes,
  patientId: string
}
