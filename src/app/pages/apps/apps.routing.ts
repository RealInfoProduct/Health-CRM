import { Routes } from '@angular/router';

// import { AppChatComponent } from './chat/chat.component';
import { AppPermissionComponent } from './permission/permission.component';
import { AppContactComponent } from './contact/contact.component';
import { AppCoursesComponent } from './courses/courses.component';
import { AppCourseDetailComponent } from './courses/course-detail/course-detail.component';
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

export const AppsRoutes: Routes = [
  {
    path: '',
    children: [
    
      {
        path: 'permission',
        component: AppPermissionComponent,
        data: {
          title: 'Roll Base Access',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Roll Base Access' },
          ],
        },
      },
      {
        path: 'appointments',
        component: AppointmentsComponent,
        data: {
          title: 'Appointments',
          urls: [
            { title: 'Dashboard', url: '/apps/appointments' },
            { title: 'Appointments' },
          ],
        },
      },
      {
        path: 'medical',
        component: MedicalComponent,
        data: {
          title: 'Medical',
          urls: [
            { title: 'Dashboard', url: '/apps/medical' },
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
            { title: 'Dashboard', url:'/apps/laboratory' },
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
            { title: 'Dashboard', url:'/apps/lab' },
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
            { title: 'Dashboard', url:'/apps/staff' },
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
            { title: 'Dashboard', url:'/apps/report' },
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
            { title: 'Dashboard', url:'/apps/patient' },
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
            { title: 'Dashboard', url:'/apps/medicine' },
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
            { title: 'Dashboard', url:'/apps/doctors' },
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
            { title: 'Dashboard', url:'/apps/bill' },
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
            { title: 'Dashboard', url:'/apps/clinic' },
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
            { title: 'Dashboard', url:'/apps/receptionist' },
            { title: 'Receptionist' },
          ],
        },
      },
      {
        path: 'contacts',
        component: AppContactComponent,
        data: {
          title: 'Contacts',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Contacts' },
          ],
        },
      },
      {
        path: 'courses',
        component: AppCoursesComponent,
        data: {
          title: 'Courses',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Courses' },
          ],
        },
      },
      {
        path: 'courses/coursesdetail/:id',
        component: AppCourseDetailComponent,
        data: {
          title: 'Course Detail',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Course Detail' },
          ],
        },
      },
    ],
  },
];
