import { ChooseAddPatientMethod } from './ChooseAddPatientMethod'
import { ConfirmDeleteCommon } from './ConfirmDeleteCommon'
import { Progress } from './Progress'
import { Info } from './Info'
import { ChooseTemplate } from './ChooseTemplate'
import { ChooseTeeth } from './ChooseTeeth'
import { UserInfo } from './UserInfo'
import { ChooseSync } from './ChooseSync'

export type RegistredModalContent = typeof RegisterContent

const RegisterContent = {
  ChooseAddPatientMethod,
  ConfirmDeleteCommon,
  Progress,
  Info,
  ChooseTemplate,
  ChooseTeeth,
  UserInfo,
  ChooseSync
} as const

export default RegisterContent
