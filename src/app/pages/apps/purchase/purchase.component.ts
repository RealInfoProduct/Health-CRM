import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { PurchaseDialogComponent } from './purchase-dialog/purchase-dialog.component';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { PurchaseViewComponent } from './purchase-view/purchase-view.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit{
  searchText: any;
  datePurchaseListForm: FormGroup;
  purchaseColumns: string[] = [
    'id',
    'purchaseDate',
    'supplierName',
    'total',
    'action'
  ];
  
  purchaseList: any = []
  
  dataSource = new MatTableDataSource(this.purchaseList);
  userId = localStorage.getItem('userId')
  clinicId = localStorage.getItem('clinicId')
  medicalId = localStorage.getItem('MedicalId')

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null); 
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

constructor(
   private fb: FormBuilder,
  public dialog: MatDialog,
    private firebaseCollectionService: FirebaseCollectionService
){}

ngOnInit(): void {
    this.getPurchaseData()
      const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.datePurchaseListForm = this.fb.group({
      start: [startDate],
      end: [endDate]
    });
}

filterDate() {
    if (!this.purchaseList) return;
    const startDate = this.datePurchaseListForm.value.start ? new Date(this.datePurchaseListForm.value.start) : null;
    const endDate = this.datePurchaseListForm.value.end ? new Date(this.datePurchaseListForm.value.end) : null;

    if (startDate && endDate) {
      this.dataSource.data = this.purchaseList.filter((invoice: any) => {
        if (!invoice.purchaseDate) return false;

        let invoiceDate;
        if (invoice.purchaseDate.toDate) {
          invoiceDate = invoice.purchaseDate.toDate();
        } else if (invoice.purchaseDate instanceof Date) {
          invoiceDate = invoice.purchaseDate;
        } else {
          return false;
        }

        return invoiceDate >= startDate && invoiceDate <= endDate;
      });
    } else {
      this.dataSource.data = this.purchaseList;
    }
  }

  getPurchaseData() {
    this.firebaseCollectionService.getpurchase(this.userId, this.clinicId,this.medicalId,'purchaselist').then((purchase) => {  
      this.purchaseList = purchase
      
      if (purchase && purchase.length > 0) {
        this.dataSource = new MatTableDataSource(this.purchaseList);
        this.dataSource.paginator = this.paginator;
      } else {
        this.purchaseList = [];
        this.dataSource = new MatTableDataSource(this.purchaseList);
        this.dataSource.paginator = this.paginator;
      }
      this.filterDate()
    }).catch((error) => {
      console.error('Error fetching Purchase:', error);
    });
  }


 applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openPurchaseDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(PurchaseDialogComponent, {
      data: obj,
      width: action === 'Delete' ? '25%' : '50%'
    })
    
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.firebaseCollectionService.addpurchase(this.userId, this.clinicId,this.medicalId,result.data)
        this.getPurchaseData()
      }
      if (result?.event === 'Update') {
        this.purchaseList.forEach((element: any) => {
          if (obj.id === element.id) {
            this.firebaseCollectionService.updatepurchase(this.userId, this.clinicId,this.medicalId, obj.id, result.data);
            this.getPurchaseData()
          }
        })
      }
      if (result?.event === 'Delete') {
        this.firebaseCollectionService.deletepurchase(this.userId, this.clinicId,this.medicalId, obj.id);
        this.getPurchaseData()
      }
    })
  }

  openPurchaseView(obj: any) {
      const dialogRef = this.dialog.open(PurchaseViewComponent, {
        data: obj,
      })
    }

    getTotal(element: any): number {
  return element.medicine?.reduce(
    (sum: number, m: any) => sum + (m.qty * m.price),
    0
  ) || 0;
}
}
