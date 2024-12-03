import { Component, OnInit, ViewChild } from '@angular/core';
import { AppointmentsDialogComponent } from './appointments-dialog/appointments-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;

  appointmentsColumns: string[] = [
    'id',
    'patientName',
    'doctorName',
    'gender',
    'date',
    'time',
    'address',
    'mobileNumber',
    'email',
    'bloodGroup',
    'age',
    'appointmentStatus',
    'visitType',
    'paymentMethod',
    'action'
  ]

  appointmentslist: any = []
  doctorslist: any = []

  userType:any = localStorage.getItem('usertype')
  dataSource = new MatTableDataSource(this.appointmentslist)
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    public dialog: MatDialog,
    private firebaseCollectionService: FirebaseCollectionService
  ) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getappointmentdata()
    this.getdoctorsdata()
  }

  getdoctorsdata() {
    this.firebaseCollectionService.getDocuments('ClinicList', 'doctorslist').then((doctors) => {
      this.doctorslist = doctors 
    }).catch((error) =>{
      console.error('Error fetching doctors:', error);
    }) 
  }

  getappointmentdata() {
    this.firebaseCollectionService.getDocuments('ClinicList', 'appointmentslist').then((appointment) => {
      this.appointmentslist = appointment
      if (appointment && appointment.length > 0) {
        this.dataSource = new MatTableDataSource(this.appointmentslist)
        this.dataSource.paginator = this.paginator
      } else {
        this.appointmentslist = []
        this.dataSource = new MatTableDataSource(this.appointmentslist)
        this.dataSource.paginator = this.paginator
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
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAppointmentsDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppointmentsDialogComponent, {
      data: obj,
      width: action === 'Delete' ? '25%' : '50%'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.firebaseCollectionService.addDocument('ClinicList', result.data, 'appointmentslist');
        this.getappointmentdata()
      } else if (result.event === 'Update') {
        this.appointmentslist.forEach((element: any) => {
          if (obj.id === element.id) {
            this.firebaseCollectionService.updateDocument('ClinicList', obj.id, result.data, 'appointmentslist');
            this.getappointmentdata()
          }
        });
      } else if (result.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('ClinicList', obj.id, 'appointmentslist');
        this.getappointmentdata()
      }

    })
  }

  getDoctorslist(doctorId: string): string {  
    return this.doctorslist.find((doctorObj:any) => doctorObj.id === doctorId)?.doctorsName ;
  }
  
}
