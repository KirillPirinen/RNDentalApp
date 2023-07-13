import type { Contact } from 'expo-contacts';
import type { PhoneDTO } from '../../pages/AddPatient';
import type Appointment from '../models/Appointment';
import type Tooth from '../models/Tooth';
import type Template from '../models/Template';
import type File from '../models/File';
import type Group from '../models/Group';

export type createPatientParams = {
  phones?: PhoneDTO[]
  phoneNumbers?: Contact['phoneNumbers']
  image?: Contact['image']
  id?: Contact['id']
} & (
  { fullName: string; name?: never; } | { name: string; fullName?: never }
)

export type createPatientOptions = { withReturn?: boolean; }
export type createAppointmentParams = Pick<Appointment, 'patientId' | 'date' | 'duration'> & { diagnosis?: string; notes?: string; }
export type createToothParams = Pick<Tooth, 'formulaId' | 'toothNo' | 'toothState'> & { notes?: string; }
export type createTemplateParams = Pick<Template, 'text' | 'name'>
export type createFileParams = Pick<File, 'name' | 'type' | 'patientId'>
export type createGroupParams = Pick<Group, 'name' | 'description' | 'color'>
