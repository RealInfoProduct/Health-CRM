 import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MedicineDialogComponent } from './medicine-dialog/medicine-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { MatPaginator } from '@angular/material/paginator';

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
    'medicineName',
    'companyName',
    'category',
    'pack',
    'qty',
    'rate',
    'amount',
    'disc',
    'gst',
    'netamt',
    'action'
  ];

  medicinelist: any = []

  dataSource = new MatTableDataSource(this.medicinelist);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    public dialog: MatDialog,
    private firebaseCollectionService:FirebaseCollectionService) { }

    ngOnInit(): void {
      this.dataSource.paginator = this.paginator
      this.getmedicineData()
    }

   getmedicineData(){
    this.firebaseCollectionService.getDocuments('ClinicList','medicinelist').then((medicine) =>{
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

  openMedicineDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(MedicineDialogComponent, {
      data: obj,
      width: action === 'Delete' ? '25%' : '50%'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.firebaseCollectionService.addDocument('ClinicList', result.data ,'medicinelist')
        this.getmedicineData()
      }
      if (result.event === 'Update') {
        this.medicinelist.forEach((element: any) => {
          if (obj.id === element.id) {
            this.firebaseCollectionService.updateDocument('ClinicList', obj.id, result.data, 'medicinelist')
            this.getmedicineData()
          }
        })
        this.dataSource = new MatTableDataSource(this.medicinelist)
      }
      if (result.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('ClinicList', obj.id, 'medicinelist')
        this.getmedicineData()
      }
    });
  }
}
