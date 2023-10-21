import Appointment from "../db/models/Appointment";
import Patient from "../db/models/Patient";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList {
      'Detail': { patient: Patient };
      'AddPatient': { patient: Patient; phones: Phone[] } | undefined;
      'ImportContacts': any;
      'AddAppointment': { patient?: Patient, appointment?: Appointment, edit?: boolean, startDate?: Appointment['date'] } | undefined;
      'ConfirmAppointment': { patient: Patient, appointment: Appointment, edit?: boolean };
      'AddTemplate': { template: Template, edit?: boolean } | undefined;
      'TemplatesList': any;
      'TeethFormula': { patient: Patient };
      'DatabasesList': any;
      'GroupList': any;
      'AddGroup': { group: Template, edit?: boolean } | undefined;
      'AppointmentsCalendar': any
    }
  }
}
