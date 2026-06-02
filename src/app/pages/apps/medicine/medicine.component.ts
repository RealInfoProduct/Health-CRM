import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MedicineDialogComponent } from './medicine-dialog/medicine-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { MatPaginator } from '@angular/material/paginator';
import { Timestamp } from 'firebase/firestore';
import { MedicineViewComponent } from './medicine-view/medicine-view.component';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  dateMedicineForm: FormGroup;
  originalMedicine: any[] = [];
  Stocklist: any[] = [];


  dataSource = new MatTableDataSource(this.medicinelist);
  userId = localStorage.getItem('userId')
  clinicId = localStorage.getItem('clinicId')
  medicalId = localStorage.getItem('MedicalId')

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
     private fb: FormBuilder,
    public dialog: MatDialog,
    private firebaseCollectionService:FirebaseCollectionService) { }

  ngOnInit(): void {
    this.getmedicineData()
    this.dateMedicineForm = this.fb.group({
      start: [new Date()],
    });
    this.dataSource.paginator = this.paginator
    this.getappointmentdata()
    this.getStockData() 
  }

   filterDate(selectedDate: Date | null) {


  const targetDate = selectedDate ? new Date(selectedDate) : new Date();

  targetDate.setHours(0, 0, 0, 0);

  const filtered = this.originalMedicine.filter((item: any) => {

    let itemDate: Date | null = null;

    if (item.createdAt?.toDate) {
      itemDate = item.createdAt.toDate(); 
    } else {
      itemDate = new Date(item.createdAt);
    }

    if (!itemDate) return false;

    itemDate.setHours(0, 0, 0, 0);

    return itemDate.getTime() === targetDate.getTime();
  });

  this.dataSource = new MatTableDataSource(filtered);
  this.dataSource.paginator = this.paginator;
}

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
    

   getStockData() {
    this.firebaseCollectionService.getStock(this.userId, this.clinicId, this.medicalId, 'Stocklist').then((Stock) => {
      if (Stock && Stock.length > 0) {
        this.Stocklist = Stock
        
      }
    })
  }
    
   getmedicineData(){

    this.firebaseCollectionService.getMedicine(this.userId,this.clinicId,this.medicalId,'medicinelist').then((medicine) =>{
       // =========================
      // SORT BY LATEST TIME
      // =========================
      medicine.sort((a: any, b: any) => {

        const dateA = new Date(`${a.createdAt} ${a.time}`);
        const dateB = new Date(`${b.createdAt} ${b.time}`);

        return dateB.getTime() - dateA.getTime();
      });
      this.medicinelist = medicine
      this.originalMedicine = medicine
      if(medicine && medicine.length > 0){
        this.dataSource = new MatTableDataSource(this.medicinelist)
        this.dataSource.paginator = this.paginator 
        
      } else {
        this.medicinelist = [];
        this.dataSource = new MatTableDataSource(this.medicinelist);
        this.dataSource.paginator = this.paginator;
      }
     this.filterDate(null);
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
      width: action === 'Delete' ? '25%' : '65%'
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result.event === 'Add') {
        this.firebaseCollectionService.addMedicine(this.userId,this.clinicId,this.medicalId, result.data)
        this.getmedicineData()
      }
      // if (result.event === 'Update') {
      //   this.medicinelist.forEach((element: any) => {
      //     if (obj.id === element.id) {
      //       this.firebaseCollectionService.updateMedicine(this.userId,this.clinicId,this.medicalId, obj.id, result.data)
      //       this.firebaseCollectionService.updatepurchase(this.userId,this.clinicId,this.medicalId, obj.id, result.data)
      //       this.getmedicineData()
      //     }
      //   })
      //   this.dataSource = new MatTableDataSource(this.medicinelist)
      // }
  if (result.event === 'Update') {

    const soldMedicines = result.data.medicine || [];


    // medicine array loop
    for (const soldItem of soldMedicines) {


      // stock item find
      const stockItem = this.Stocklist.find((stock: any) =>

        stock.medicineName?.trim().toLowerCase() ===
        soldItem.medicineName?.trim().toLowerCase()

        &&

        stock.companyName?.trim().toLowerCase() ===
        soldItem.companyName?.trim().toLowerCase()

        &&

        stock.medicineType?.trim().toLowerCase() ===
        soldItem.category?.trim().toLowerCase()
      );


      // if stock found
      if (stockItem) {

        const stockQty = Number(stockItem.qty) || 0;

        const soldQty = Number(soldItem.qty) || 0;

        const remainingQty = stockQty - soldQty;

        const updatedStock = {
          ...stockItem,
          qty: remainingQty < 0 ? 0 : remainingQty
        };


        try {

          await this.firebaseCollectionService.updateStock(
            this.userId,
            this.clinicId,
            this.medicalId,
            stockItem.id,
            updatedStock
          );


        } catch (error) {

          console.error('STOCK UPDATE ERROR => ', error);

        }
      } else {

      }
    }

    // update medicine bill
    try {

      await this.firebaseCollectionService.updateMedicine(
        this.userId,
        this.clinicId,
        this.medicalId,
        obj.id,
        result.data
      );


    } catch (error) {

      console.error('MEDICINE UPDATE ERROR => ', error);

    }

    this.getStockData();
    this.getmedicineData();
  }
      if (result.event === 'Delete') {

  // deleted medicine bill data
  const deletedMedicines = obj.medicine || [];


  // loop deleted medicine array
  for (const deletedItem of deletedMedicines) {


    // find stock item
    const stockItem = this.Stocklist.find((stock: any) =>

      stock.medicineName?.trim().toLowerCase() ===
      deletedItem.medicineName?.trim().toLowerCase()

      &&

      stock.companyName?.trim().toLowerCase() ===
      deletedItem.companyName?.trim().toLowerCase()

      &&

      stock.medicineType?.trim().toLowerCase() ===
      deletedItem.category?.trim().toLowerCase()
    );


    // if stock found
    if (stockItem) {

      const currentStockQty = Number(stockItem.qty) || 0;

      const deletedQty = Number(deletedItem.qty) || 0;

      // add deleted qty back to stock
      const updatedQty = currentStockQty + deletedQty;

      const updatedStock = {
        ...stockItem,
        qty: updatedQty
      };


      try {

        await this.firebaseCollectionService.updateStock(
          this.userId,
          this.clinicId,
          this.medicalId,
          stockItem.id,
          updatedStock
        );


      } catch (error) {

        console.error('STOCK UPDATE ERROR => ', error);

      }
    }
  }

  // delete medicine bill
  await this.firebaseCollectionService.deleteMedicine(
    this.userId,
    this.clinicId,
    this.medicalId,
    obj.id
  );

  this.getmedicineData();
  this.getStockData();
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
