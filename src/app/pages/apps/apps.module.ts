import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { NgxPermissionsModule } from 'ngx-permissions';

import { NgxPaginationModule } from 'ngx-pagination';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgScrollbarModule } from 'ngx-scrollbar';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

//Chat
import { AppChatComponent } from './chat/chat.component';
//Contact
import { AppContactDialogContentComponent } from './contact/contact.component';
import { AppContactComponent } from './contact/contact.component';
//Courses
import { AppCoursesComponent } from './courses/courses.component';
import { AppCourseDetailComponent } from './courses/course-detail/course-detail.component';

//Notes
import { AppNotesComponent } from './notes/notes.component';
//Todo
import { AppTodoComponent } from './todo/todo.component';
// Permission
import { AppPermissionComponent } from './permission/permission.component';
//Mailbox
import {
  ListingComponent,
  ListingDialogDataExampleDialogComponent,
} from './email/listing/listing.component';
import { DetailComponent } from './email/detail/detail.component';
import { AppEmailComponent } from './email/email.component';

//Taskboard
import { AppTaskboardComponent } from './taskboard/taskboard.component';
import { TaskDialogComponent } from './taskboard/task-dialog.component';
import { OkAppTaskComponent } from './taskboard/ok-task/ok-task.component';
import { DeleteAppTaskComponent } from './taskboard/delete-task/delete-task.component';

//Calendar
import { AppFullcalendarComponent } from './fullcalendar/fullcalendar.component';
import { CalendarDialogComponent } from './fullcalendar/fullcalendar.component';
import { CalendarFormDialogComponent } from './fullcalendar/calendar-form-dialog/calendar-form-dialog.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { AppEmployeeComponent } from './employee/employee.component';
import { AppEmployeeDialogContentComponent } from './employee/employee.component';
import { AppAddEmployeeComponent } from './employee/add/add.component';

import { AppsRoutes } from './apps.routing';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import {
  AppTicketlistComponent,
  AppTicketDialogContentComponent,
} from './ticketlist/ticketlist.component';

//Invoice
import { AppInvoiceListComponent } from './invoice/invoice-list/invoice-list.component';
import { AppInvoiceViewComponent } from './invoice/invoice-view/invoice-view.component';
import { AppAddInvoiceComponent } from './invoice/add-invoice/add-invoice.component';
import { AppEditInvoiceComponent } from './invoice/edit-invoice/edit-invoice.component';
import { OkDialogComponent } from './invoice/edit-invoice/ok-dialog/ok-dialog.component';
import { AddedDialogComponent } from './invoice/add-invoice/added-dialog/added-dialog.component';

// blog
import { AppBlogsComponent } from './blogs/blogs.component';
import { AppBlogDetailsComponent } from './blogs/details/details.component';
import { MedicalComponent } from './medical/medical.component';
import { AddmedicaldialogComponent } from './medical/addmedicaldialog/addmedicaldialog.component';
import { LaboratoryComponent } from './laboratory/laboratory.component';
import { AddlaboratorydialogComponent } from './laboratory/addlaboratorydialog/addlaboratorydialog.component';
import { LabComponent } from './lab/lab.component';
import { AddlabdialogComponent } from './lab/addlabdialog/addlabdialog.component';
import { MyReportComponent } from './my-report/my-report.component';
import { PatientDialogComponent } from './patient/patient-dialog/patient-dialog.component';
import { PatientComponent } from './patient/patient.component';
import { MedicineComponent } from './medicine/medicine.component';
import { MedicineDialogComponent } from './medicine/medicine-dialog/medicine-dialog.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { AdddoctorsdialogComponent } from './doctors/adddoctorsdialog/adddoctorsdialog.component';
import { BillComponent } from './bill/bill.component';
import { AddbilldialogComponent } from './bill/addbilldialog/addbilldialog.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { AppointmentsDialogComponent } from './appointments/appointments-dialog/appointments-dialog.component';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatInputModule } from '@angular/material/input';
import { StaffComponent } from './staff/staff.component';
import { StaffDialogComponent } from './staff/staff-dialog/staff-dialog.component';
import { LaboratoryViewComponent } from './patient/laboratory-view/laboratory-view.component';
import { MedicalViewComponent } from './patient/medical-view/medical-view.component';
import { ReportViewComponent } from './lab/report-view/report-view.component';
import { ClicnkComponent } from './clicnk/clicnk.component';
import { ClicnkDialogComponent } from './clicnk/clicnk-dialog/clicnk-dialog.component';
import { ReceptionistComponent } from './receptionist/receptionist.component';
import { ReceptionistDialogComponent } from './receptionist/receptionist-dialog/receptionist-dialog.component';
import { MedicineViewComponent } from './medicine/medicine-view/medicine-view.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AppsRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPermissionsModule.forRoot(),
    NgApexchartsModule,
    TablerIconsModule.pick(TablerIcons),
    DragDropModule,
    NgxPaginationModule,
    HttpClientModule,
    AngularEditorModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatNativeDateModule,
    NgScrollbarModule,
    MatInputModule,
    NgxMatTimepickerModule,
  ],
  exports: [TablerIconsModule,MedicineComponent,MedicalComponent],
  declarations: [
    AppChatComponent,
    AppPermissionComponent,
    AppNotesComponent,
    AppTodoComponent,
    AppTaskboardComponent,
    TaskDialogComponent,
    OkAppTaskComponent,
    DeleteAppTaskComponent,
    ListingDialogDataExampleDialogComponent,
    ListingComponent,
    DetailComponent,
    AppEmailComponent,
    AppFullcalendarComponent,
    CalendarDialogComponent,
    CalendarFormDialogComponent,
    AppTicketlistComponent,
    AppTicketDialogContentComponent,
    AppContactComponent,
    AppContactDialogContentComponent,
    AppCoursesComponent,
    AppCourseDetailComponent,
    AppEmployeeComponent,
    AppEmployeeDialogContentComponent,
    AppAddEmployeeComponent,
    AppInvoiceListComponent,
    AppInvoiceViewComponent,
    AppAddInvoiceComponent,
    AppEditInvoiceComponent,
    AddedDialogComponent,
    OkDialogComponent,
    AppBlogsComponent,
    AppBlogDetailsComponent,
    MedicalComponent,
    AddmedicaldialogComponent,
    LaboratoryComponent,
    AddlaboratorydialogComponent,
    LabComponent,
    AddlabdialogComponent,
    MyReportComponent,
    PatientComponent,
    PatientDialogComponent,
    MedicineComponent,
    MedicineDialogComponent,
    DoctorsComponent,
    AdddoctorsdialogComponent,
    BillComponent,
    AddbilldialogComponent,
    AppointmentsComponent,
    AppointmentsDialogComponent,
    StaffComponent,
    StaffDialogComponent,
    LaboratoryViewComponent,
    MedicalViewComponent,
    ReportViewComponent,
    ClicnkComponent,
    ClicnkDialogComponent,
    ReceptionistComponent,
    ReceptionistDialogComponent,
    MedicineViewComponent,

  ],
  providers: [  { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class AppsModule {}
