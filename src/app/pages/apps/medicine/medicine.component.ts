import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MedicineDialogComponent } from './medicine-dialog/medicine-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { MatPaginator } from '@angular/material/paginator';
import { Timestamp } from 'firebase/firestore';
import { MedicineViewComponent } from './medicine-view/medicine-view.component';

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
    'mobileNumber',
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

      } else {
        // Fetch from Firebase if not found in localStorage
        this.firebaseCollectionService.getDocuments('Doctor', 'appointmentslist').then((appointment) => {
          if (appointment && appointment.length > 0) {
            this.appointmentslist = appointment;
    
            // Store the fetched data in localStorage
            localStorage.setItem('appointmentslist', JSON.stringify(this.appointmentslist));
          }
        }).catch((error) => {
          console.error('Error fetching appointments:', error);
        });
      }
    }
    
    
   getmedicineData(){
    const userId = localStorage.getItem('userId')
  const clinicId = localStorage.getItem('clinicId')
  const medicalId = localStorage.getItem('MedicalId')
    this.firebaseCollectionService.getMedicine(userId,clinicId,medicalId,'medicinelist').then((medicine) =>{
      this.medicinelist = medicine
      if(medicine && medicine.length > 0){
        this.dataSource = new MatTableDataSource(this.medicinelist)
        this.dataSource.paginator = this.paginator 
        
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
      width: action === 'Delete' ? '25%' : '60%'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        const userId = localStorage.getItem('userId')
        const clinicId = localStorage.getItem('clinicId')
        const MedicineId = localStorage.getItem('MedicalId')
        this.firebaseCollectionService.addMedicine(userId, clinicId,MedicineId, result.data)
        this.getmedicineData()
      }
      if (result.event === 'Update') {
        this.medicinelist.forEach((element: any) => {
          if (obj.id === element.id) {
               const userId = localStorage.getItem('userId')
        const clinicId = localStorage.getItem('clinicId')
        const MedicineId = localStorage.getItem('MedicalId')
            this.firebaseCollectionService.updateMedicine(userId, clinicId,MedicineId, obj.id, result.data)
            this.getmedicineData()
          }
        })
        this.dataSource = new MatTableDataSource(this.medicinelist)
      }
      if (result.event === 'Delete') {
           const userId = localStorage.getItem('userId')
        const clinicId = localStorage.getItem('clinicId')
        const MedicineId = localStorage.getItem('MedicalId')
        this.firebaseCollectionService.deleteMedicine(userId, clinicId,MedicineId, obj.id)
        this.getmedicineData()
      }
    });
  }

  getappointmentlist(medicineId: string): string {  
    return this.appointmentslist.find((appointmentObj:any) => appointmentObj.id === medicineId)?.firstName ;
  }

  openMedical(obj: any) {
      const dialogRef = this.dialog.open(MedicineViewComponent, {
        data: obj,
      })
    }
}
