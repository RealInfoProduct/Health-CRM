import { Routes } from '@angular/router';

// import { AppChatComponent } from './chat/chat.component';
import { MedicalComponent } from './medical/medical.component';
import { LaboratoryComponent } from './laboratory/laboratory.component';
import { LabComponent } from './lab/lab.component';
import { MyReportComponent } from './my-report/my-report.component';
import { PatientComponent } from './patient/patient.component';
import { MedicineComponent } from './medicine/medicine.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { BillComponent } from './bill/bill.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { StaffComponent } from './staff/staff.component';
import { ClicnkComponent } from './clicnk/clicnk.component';
import { ReceptionistComponent } from './receptionist/receptionist.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { StockComponent } from './stock/stock.component';
import { AdmitPatientComponent } from './admit-patient/admit-patient.component';
import { DailyRoutineComponent } from './daily-routine/daily-routine.component';

export const AppsRoutes: Routes = [
  {
    path: '',
    children: [

      {
        path: 'appointments',
        component: AppointmentsComponent,
        data: {
          title: 'Appointments',
          urls: [
            {  url: '/apps/appointments' },
            { title: 'Appointments' },
          ],
        },
      },
      {
        path: 'purchase',
        component: PurchaseComponent,
        data: {
          title: 'Purchase',
          urls: [
            {  url: '/apps/purchase' },
            { title: 'Purchase' },
          ],
        },
      },
      {
        path: 'admitpatient',
        component: AdmitPatientComponent,
        data: {
          title: 'AdmitPatient',
          urls: [
            {  url: '/apps/admitpatient' },
            { title: 'AdmitPatient' },
          ],
        },
      },
      {
        path: 'stock',
        component: StockComponent,
        data: {
          title: 'Stock',
          urls: [
            {  url: '/apps/stock' },
            { title: 'Stock' },
          ],
        },
      },
      {
        path: 'medical',
        component: MedicalComponent,
        data: {
          title: 'Medical',
          urls: [
            {  url: '/apps/medical' },
            { title: 'Medical' },
          ],
        },
      },
      {
        path: 'laboratory',
        component: LaboratoryComponent,
        data: {
          title: 'Laboratory',
          urls: [
            {  url:'/apps/laboratory' },
            { title: 'Laboratory' },
          ],
        },
      },
      {
        path: 'lab',
        component: LabComponent,
        data: {
          title: 'Lab',
          urls: [
            {  url:'/apps/lab' },
            { title: 'Lab' },
          ],
        },
      },
      {
        path: 'staff',
        component: StaffComponent,
        data: {
          title: 'Staff',
          urls: [
            {  url:'/apps/staff' },
            { title: 'Staff' },
          ],
        },
      },
      {
        path: 'report',
        component: MyReportComponent,
        data: {
          title: 'My Report',
          urls: [
            {  url:'/apps/report' },
            { title: 'My Report' },
          ],
        },
      },
      {
        path: 'patient',
        component: PatientComponent,
        data: {
          title: 'Patient',
          urls: [
            {  url:'/apps/patient' },
            { title: 'Patient' },
          ],
        },
      },
      {
        path: 'medicine',
        component: MedicineComponent,
        data: {
          title: 'Medicine',
          urls: [
            {  url:'/apps/medicine' },
            { title: 'Medicine' },
          ],
        },
      },
      {
        path: 'doctors',
        component: DoctorsComponent,
        data: {
          title: 'Doctors',
          urls: [
            {  url:'/apps/doctors' },
            { title: 'Doctors' },
          ],
        },
      },
      {
        path: 'bill',
        component: BillComponent,
        data: {
          title: 'Bill',
          urls: [
            {  url:'/apps/bill' },
            { title: 'Bill' },
          ],
        },
      },
      {
        path: 'clinic',
        component: ClicnkComponent,
        data: {
          title: 'Clinic',
          urls: [
            {  url:'/apps/clinic' },
            { title: 'Clinic' },
          ],
        },
      },
      {
        path: 'receptionist',
        component: ReceptionistComponent,
        data: {
          title: 'Receptionist',
          urls: [
            { url:'/apps/receptionist' },
            { title: 'Receptionist' },
          ],
        },
      },
      {
        path: 'daliyRoutine',
        component: DailyRoutineComponent,
        data: {
          title: 'Daliy Routine',
          urls: [
            { url:'/apps/daliyRoutine' },
            { title: 'Daliy Routine' },
          ],
        },
      },
     
    ],
  },
];
