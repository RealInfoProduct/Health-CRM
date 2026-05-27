import { Component, OnInit, ViewChild } from '@angular/core';
import { AppointmentsDialogComponent } from './appointments-dialog/appointments-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;
    dateAppointmentsForm: FormGroup;

  appointmentsColumns: string[] = [
    'id',
    'tokenNumber',
    'patientName',
    'doctorName',
    'gender',
    'date',
    'time',
    'address',
    'mobileNumber',
    // 'email',
    'bloodGroup',
    'age',
    'weight',
    'appointmentStatus',
    'visitType',
    'paymentMethod',
    'action'
  ]

  appointmentslist: any = []
  doctorslist: any = []
  patientlist: any = []
  originalAppointments: any[] = [];

  userType:any = localStorage.getItem('usertype')
  dataSource = new MatTableDataSource(this.appointmentslist)
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  userId = localStorage.getItem('userId')
  clinicId = localStorage.getItem('clinicId')
  ReceptionistId = localStorage.getItem('ReceptionistId')
  constructor(
     private fb: FormBuilder,
    public dialog: MatDialog,
    private firebaseCollectionService: FirebaseCollectionService
  ) { }

  ngOnInit(): void {
    this.dateAppointmentsForm = this.fb.group({
      start: [new Date()],
    });
    this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data: any, filter: string) => {
    const fullName = (data.firstName + ' ' + data.lastName).toLowerCase();
    return fullName.includes(filter);
  };
 
    this.getappointmentdata()
    this.getdoctorsdata()
    this.getPatientData() 
  }

filterDate(selectedDate: Date | null) {


  const targetDate = selectedDate ? new Date(selectedDate) : new Date();

  targetDate.setHours(0, 0, 0, 0);

  const filtered = this.originalAppointments.filter((item: any) => {

    let itemDate: Date | null = null;

    if (item.date?.toDate) {
      itemDate = item.date.toDate(); 
    } else {
      itemDate = new Date(item.date);
    }

    if (!itemDate) return false;

    itemDate.setHours(0, 0, 0, 0);

    return itemDate.getTime() === targetDate.getTime();
  });

  this.dataSource = new MatTableDataSource(filtered);
  this.dataSource.paginator = this.paginator;
}

getdoctorsdata() {
      const userId = localStorage.getItem('userId')
     const clinicId = localStorage.getItem('clinicId')
    this.firebaseCollectionService.getDoctors(userId, clinicId,'doctorsList').then((doctors) => { 
      if (doctors && doctors.length > 0) {
        this.doctorslist = doctors
      }
    }).catch((error) => {
      console.error('Error fetching doctors:', error);
    })

  }

  getappointmentdata() {
    const userId = localStorage.getItem('userId')
        const clinicId = localStorage.getItem('clinicId')
        const ReceptionistId = localStorage.getItem('ReceptionistId')
    this.firebaseCollectionService.getAppointmentsList(userId, clinicId, ReceptionistId,'appointmentslist').then((appointment) => {
            appointment.sort((a: any, b: any) => {
        return Number(b.tokenNumber) - Number(a.tokenNumber);
      });
      this.appointmentslist = appointment
        this.originalAppointments = appointment
      if (appointment && appointment.length > 0) {
        this.dataSource = new MatTableDataSource(this.appointmentslist)
        console.log("this.appointmentslist",this.appointmentslist);
        
        this.dataSource.paginator = this.paginator
      } else {
        this.appointmentslist = []
        this.dataSource = new MatTableDataSource(this.appointmentslist)
        this.dataSource.paginator = this.paginator
      }
      this.filterDate(null);
    })
  }

    getPatientData() {
    const userId = localStorage.getItem('userId')
    const clinicId = localStorage.getItem('clinicId')
     const doctorIds = JSON.parse(localStorage.getItem('doctorId') || '[]');
  const doctorId = doctorIds.length > 0 ? doctorIds[0] : null;
    this.firebaseCollectionService.getpatient(userId, clinicId, doctorId, 'patientlist').then((patient) => {
         if (patient && patient.length > 0) {
          this.patientlist = patient
          console.log("this.patientlist",this.patientlist); 
         }
      })
    }


  convertTimestamp(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

 applyFilter(event: Event) {

  const filterValue = (event.target as HTMLInputElement)
    .value
    .toLowerCase()
    .trim();

  if (!filterValue) {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentDateData = this.originalAppointments.filter((item: any) => {

      let itemDate: Date;

      if (item.date?.toDate) {
        itemDate = item.date.toDate();
      } else {
        itemDate = new Date(item.date);
      }

      itemDate.setHours(0, 0, 0, 0);

      return itemDate.getTime() === today.getTime();
    });

    this.dataSource.data = currentDateData;
    return;
  }


  this.dataSource.data = this.appointmentslist.filter((item: any) => {

    const fullName =
      `${item.firstName || ''} ${item.lastName || ''}`
        .toLowerCase()
        .trim();

    const mobile =
      `${item.mobileNumber || ''}`;

    return (
      fullName.includes(filterValue) ||
      mobile.includes(filterValue)
    );
  });
}

  openAppointmentsDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppointmentsDialogComponent, {
      data: obj,
      width: action === 'Delete' ? '25%' : '50%'
    });
    dialogRef.afterClosed().subscribe((result) => {

      if (result.event === 'Add') {

        const doctorId = result.data.doctorName;

        // 1. Add appointment
        this.firebaseCollectionService.addappointmentslist(
          this.userId,
          this.clinicId,
          this.ReceptionistId,
          result.data
        );

        // 2. Check patient exists
        const existingPatient = this.findExistingPatient(result.data);

        if (existingPatient) {
          // UPDATE patient
          this.firebaseCollectionService.updatepatient(
            this.userId,
            this.clinicId,
            doctorId,
            existingPatient.id,
            result.data
          );
        } 
        else {
          // ADD new patient
          this.firebaseCollectionService.addpatient(
            this.userId,
            this.clinicId,
            doctorId,
            result.data
          );
        }

        this.getappointmentdata();
        this.getPatientData();
      }
      else if (result.event === 'Update') {

        const doctorId = result.data.doctorName;

        this.firebaseCollectionService.updateAppointmentsList(
          this.userId,
          this.clinicId,
          this.ReceptionistId,
          obj.id,
          result.data
        );

        const existingPatient = this.findExistingPatient(result.data);

        if (existingPatient) {

          const updatedData = { ...result.data };
          delete updatedData.id;

          this.firebaseCollectionService.updatepatient(
            this.userId,
            this.clinicId,
            doctorId,
            existingPatient.id,
            updatedData
          );

        } else {

          this.firebaseCollectionService.addpatient(
            this.userId,
            this.clinicId,
            doctorId,
            result.data
          );
        }

        this.getappointmentdata();
        this.getPatientData();
      }
      else if (result.event === 'Delete') {

        const doctorId = obj.doctorName;

        // Delete appointment
        this.firebaseCollectionService.deleteAppointmentsList(
          this.userId,
          this.clinicId,
          this.ReceptionistId,
          obj.id
        );

        // Find matching patient from obj data
        const patient = this.patientlist.find((p: any) =>
          p.firstName?.toLowerCase().trim() === obj.firstName?.toLowerCase().trim() &&
        p.lastName?.toLowerCase().trim() === obj.lastName?.toLowerCase().trim() &&
        p.mobileNumber === obj.mobileNumber
      );
      
      // Delete patient
      if (patient) {

          this.firebaseCollectionService.deletepatient(
            this.userId,
            this.clinicId,
            doctorId,
            patient.id
          );

        }

        this.getappointmentdata();
        this.getPatientData();
      }

    })
  }

  findExistingPatient(data: any) {
  return this.patientlist.find((p: any) =>
    p.firstName?.toLowerCase().trim() === data.firstName?.toLowerCase().trim() &&
    p.lastName?.toLowerCase().trim() === data.lastName?.toLowerCase().trim() &&
    p.mobileNumber === data.mobileNumber
  );
}

 

  getDoctorslist(doctorId: string): string {  
    return this.doctorslist.find((doctorObj:any) => doctorObj.id === doctorId)?.doctorsName ;
  }
  
}
