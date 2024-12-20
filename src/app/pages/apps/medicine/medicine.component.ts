import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MedicineDialogComponent } from './medicine-dialog/medicine-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { MatPaginator } from '@angular/material/paginator';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-medicine',
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.scss']
})
export class MedicineComponent implements OnInit{

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;
  
  medicineColumns: string[] = [
    'id',
    'patientName',
    'medicineName',
    'companyName',
    'category',
    // 'pack',
    'qty',
    'rate',
    'paymentMethod',
    'amount',
    'disc',
    'gst',
    'netamt',
    'action'
  ];

  medicinelist: any = []
  appointmentslist: any = []

  dataSource = new MatTableDataSource(this.medicinelist);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    public dialog: MatDialog,
    private firebaseCollectionService:FirebaseCollectionService) { }

    ngOnInit(): void {
      this.dataSource.paginator = this.paginator
      this.getmedicineData()
      this. getappointmentdata()
    }

    // getappointmentdata() {
    //   this.firebaseCollectionService.getDocuments('Doctor', 'appointmentslist').then((appointment) => {
    //     this.appointmentslist = appointment
    //     console.log('this.appointmentslist=====>>>>>',this.appointmentslist);
        
    //   }).catch((error) =>{
    //     console.error('Error fetching doctors:', error);
    //   }) 
    // }

    getappointmentdata() {
      // Check if appointmentslist is already stored in localStorage
      const storedAppointments = localStorage.getItem('appointmentsData');
      
      if (storedAppointments) {
        // Parse the JSON string and assign it to appointmentslist
        this.appointmentslist = JSON.parse(storedAppointments);

        console.log('Loaded appointments from localStorage:', this.appointmentslist);
      } else {
        // Fetch from Firebase if not found in localStorage
        this.firebaseCollectionService.getDocuments('Doctor', 'appointmentslist').then((appointment) => {
          if (appointment && appointment.length > 0) {
            this.appointmentslist = appointment;
    
            // Store the fetched data in localStorage
            localStorage.setItem('appointmentslist', JSON.stringify(this.appointmentslist));
            console.log('Fetched appointments from Firebase and stored in localStorage:', this.appointmentslist);
          }
        }).catch((error) => {
          console.error('Error fetching appointments:', error);
        });
      }
    }
    
    
   getmedicineData(){
    this.firebaseCollectionService.getDocuments('Medical','medicinelist').then((medicine) =>{
      this.medicinelist = medicine
      if(medicine && medicine.length > 0){
        this.dataSource = new MatTableDataSource(this.medicinelist)
        this.dataSource.paginator = this.paginator 
        console.log('this.medicinelist=====>>>>>1',this.medicinelist);
        
      } else {
        this.medicinelist = [];
        this.dataSource = new MatTableDataSource(this.medicinelist);
        this.dataSource.paginator = this.paginator;
      }
    }).catch((error) => {
      console.error('Error fetching medical:', error);
    });
   } 

   applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  convertTimestamp(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  openMedicineDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(MedicineDialogComponent, {
      data: obj,
      width: action === 'Delete' ? '25%' : '50%'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.firebaseCollectionService.addDocument('Medical', result.data ,'medicinelist')
        this.getmedicineData()
        console.log("this.medicinelist=====>>>>>",this.medicinelist);
      }
      if (result.event === 'Update') {
        this.medicinelist.forEach((element: any) => {
          if (obj.id === element.id) {
            this.firebaseCollectionService.updateDocument('Medical', obj.id, result.data, 'medicinelist')
            this.getmedicineData()
            console.log("this.medicinelist=====>>>>>",this.medicinelist);
          }
        })
        this.dataSource = new MatTableDataSource(this.medicinelist)
      }
      if (result.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('Medical', obj.id, 'medicinelist')
        this.getmedicineData()
      }
    });
  }

  getappointmentlist(medicineId: string): string {  
    return this.appointmentslist.find((appointmentObj:any) => appointmentObj.id === medicineId)?.firstName ;
  }
}
