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
    'appointmentStatus',
    'visitType',
    'paymentMethod',
    'action'
  ]

  appointmentslist: any = []
  doctorslist: any = []
  medicinelist: any = []
  originalAppointments: any[] = [];

  userType:any = localStorage.getItem('usertype')
  dataSource = new MatTableDataSource(this.appointmentslist)
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

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
    this.getmedicineData()
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
    this.firebaseCollectionService.getDocuments('Doctor', 'doctorslist').then((doctors) => {
      this.doctorslist = doctors 
    }).catch((error) =>{
      console.error('Error fetching doctors:', error);
    }) 
  }

  getappointmentdata() {
    this.firebaseCollectionService.getDocuments('Doctor', 'appointmentslist').then((appointment) => {
      this.appointmentslist = appointment
        this.originalAppointments = appointment
      if (appointment && appointment.length > 0) {
        this.dataSource = new MatTableDataSource(this.appointmentslist)
        localStorage.setItem('appointmentsData', JSON.stringify(this.appointmentslist));
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
        this.firebaseCollectionService.addDocument('Doctor', result.data, 'appointmentslist');
         this.firebaseCollectionService.addDocument('Medical', result.data ,'appointmentslist')
        this.getappointmentdata()
        this.getmedicineData()
      } else if (result.event === 'Update') {
        this.appointmentslist.forEach((element: any) => {
          if (obj.id === element.id) {
            this.firebaseCollectionService.updateDocument('Doctor', obj.id, result.data, 'appointmentslist');
            this.firebaseCollectionService.updateDocument('Medical', obj.id, result.data, 'appointmentslist')
            this.getappointmentdata()
            this.getmedicineData()
          }
        });
      } else if (result.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('Doctor', obj.id, 'appointmentslist');
          this.firebaseCollectionService.deleteDocument('Medical', obj.id, 'appointmentslist')
        this.getappointmentdata()
        this.getmedicineData()
      }

    })
  }

   getmedicineData(){
    this.firebaseCollectionService.getDocuments('Medical','medicinelist').then((medicine) =>{
      if(medicine && medicine.length > 0){
        this.medicinelist = medicine
     
      }
    }).catch((error) => {
      console.error('Error fetching medical:', error);
    });
   } 

  getDoctorslist(doctorId: string): string {  
    return this.doctorslist.find((doctorObj:any) => doctorObj.id === doctorId)?.doctorsName ;
  }
  
}
