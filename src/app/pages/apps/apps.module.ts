import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
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
//Calendar

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';


import { AppsRoutes } from './apps.routing';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';


// blog
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
