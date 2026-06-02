import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit{
    displayedColumns: string[] = [
     'srno',
     'medicineName',
     'companyName',
     'medicineType',
     'qty',
     'price'
   ];
 
    Stocklist :any = []
     StockDataSource = new MatTableDataSource<any>();
     userId = localStorage.getItem('userId')
  clinicId = localStorage.getItem('clinicId')
  medicalId = localStorage.getItem('MedicalId')
     
   @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
   @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

   constructor(  private firebaseCollectionService: FirebaseCollectionService){}

   ngOnInit(): void {
       this.getStockData()
   }

   
 applyFilter(filterValue: string): void {
    this.StockDataSource.filter = filterValue.trim().toLowerCase();
  }

     getStockData() {
    this.firebaseCollectionService.getStock(this.userId, this.clinicId,this.medicalId,'Stocklist').then((stock) => {  
      
      if (stock && stock.length > 0) {
        this.Stocklist = stock
        this.StockDataSource = new MatTableDataSource(this.Stocklist);
        this.StockDataSource.paginator = this.paginator;
      }
    })
  }

}
