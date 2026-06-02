import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { PurchaseDialogComponent } from './purchase-dialog/purchase-dialog.component';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { PurchaseViewComponent } from './purchase-view/purchase-view.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    'mobileNumber',
    'total',
    'action'
  ];
  
  purchaseList: any = []
  Stocklist: any = []
  
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
    this.getStockData()
      const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.datePurchaseListForm = this.fb.group({
      start: [startDate],
      end: [endDate]
    });
}

// filterDate() {
//     if (!this.purchaseList) return;
//     const startDate = this.datePurchaseListForm.value.start ? new Date(this.datePurchaseListForm.value.start) : null;
//     const endDate = this.datePurchaseListForm.value.end ? new Date(this.datePurchaseListForm.value.end) : null;

//     if (startDate && endDate) {
//       this.dataSource.data = this.purchaseList.filter((invoice: any) => {
//         if (!invoice.purchaseDate) return false;

//         let invoiceDate;
//         if (invoice.purchaseDate.toDate) {
//           invoiceDate = invoice.purchaseDate.toDate();
//         } else if (invoice.purchaseDate instanceof Date) {
//           invoiceDate = invoice.purchaseDate;
//         } else {
//           return false;
//         }

//         return invoiceDate >= startDate && invoiceDate <= endDate;
//       });
//     } else {
//       this.dataSource.data = this.purchaseList;
//     }
//   }

filterDate() {
  if (!this.purchaseList) return;

  const startDate = this.datePurchaseListForm.value.start
    ? new Date(this.datePurchaseListForm.value.start)
    : null;

  const endDate = this.datePurchaseListForm.value.end
    ? new Date(this.datePurchaseListForm.value.end)
    : null;

  if (endDate) {
    endDate.setHours(23, 59, 59, 999);
  }

  if (startDate && endDate) {
    this.dataSource.data = this.purchaseList.filter((purchase: any) => {

      if (!purchase.purchaseDate) return false;

      let purchaseDate: Date;

      if (purchase.purchaseDate.toDate) {
        purchaseDate = purchase.purchaseDate.toDate();
      } else {
        purchaseDate = new Date(purchase.purchaseDate);
      }

      return purchaseDate >= startDate && purchaseDate <= endDate;
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

    getStockData() {
    this.firebaseCollectionService.getStock(this.userId, this.clinicId,this.medicalId,'Stocklist').then((stock) => {  
      
      if (stock && stock.length > 0) {
        this.Stocklist = stock

      }
    })
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

  const purchase = result.data;

  // 1️⃣ Save purchase
  this.firebaseCollectionService.addpurchase(
    this.userId,
    this.clinicId,
    this.medicalId,
    purchase
  );

  // 2️⃣ STOCK MERGE LOGIC
  if (purchase.medicine && Array.isArray(purchase.medicine)) {

    purchase.medicine.forEach((med: any) => {

      const newStock = {
        medicineName: med.medicineName,
        companyName: med.companyName,
        medicineType: med.medicineType,
        unit: med.unit,
        price: med.price,
        qty: med.qty,
        userId: this.userId,
        clinicId: this.clinicId,
        MedicalId: this.medicalId
      };

      // 👉 existing stock list ma match check karo
      const existing = this.Stocklist.find((s: any) =>
        s.medicineName === med.medicineName &&
        s.companyName === med.companyName &&
        s.medicineType === med.medicineType
      );

      if (existing) {
        // 3️⃣ UPDATE qty (merge)
        const updatedQty = Number(existing.qty || 0) + Number(med.qty || 0);

        const updatedStock = {
          ...existing,
          qty: updatedQty
        };
        debugger

        this.firebaseCollectionService.updateStock(
          this.userId,
          this.clinicId,
          this.medicalId,
          existing.id,
          updatedStock
        );

      } else {
        // 4️⃣ NEW STOCK
        this.firebaseCollectionService.addStock(
          this.userId,
          this.clinicId,
          this.medicalId,
          newStock
        );
      }
    });
  }

  this.getPurchaseData();
  this.getStockData();
}
if (result?.event === 'Update') {

  const oldPurchase = obj;
  const newPurchase = result.data;

  if (newPurchase.medicine?.length) {

    newPurchase.medicine.forEach((newMed: any) => {

      const oldMed = oldPurchase.medicine.find((m: any) =>
        m.medicineName === newMed.medicineName &&
        m.companyName === newMed.companyName &&
        m.medicineType === newMed.medicineType
      );

      const existing = this.Stocklist.find((s: any) =>
        s.medicineName === newMed.medicineName &&
        s.companyName === newMed.companyName &&
        s.medicineType === newMed.medicineType
      );

      if (existing) {

        let finalQty = Number(existing.qty || 0);

        const oldQty = Number(oldMed?.qty || 0);
        const newQty = Number(newMed?.qty || 0);

        // ✅ only qty changed
        if (oldQty !== newQty) {

          const diffQty = newQty - oldQty;

          finalQty = finalQty + diffQty;
        }

        const updatedStock = {
          ...existing,

          // ✅ always update latest price
          price: newMed.price,

          // ✅ qty only when changed
          qty: finalQty
        };

        this.firebaseCollectionService.updateStock(
          this.userId,
          this.clinicId,
          this.medicalId,
          existing.id,
          updatedStock
        );

      } else {

        // new medicine
        const newStock = {
          medicineName: newMed.medicineName,
          companyName: newMed.companyName,
          medicineType: newMed.medicineType,
          unit: newMed.unit,
          price: newMed.price,
          qty: newMed.qty,
          userId: this.userId,
          clinicId: this.clinicId,
          MedicalId: this.medicalId
        };

        this.firebaseCollectionService.addStock(
          this.userId,
          this.clinicId,
          this.medicalId,
          newStock
        );
      }

    });
  }

  // purchase update
  this.firebaseCollectionService
    .updatepurchase(
      this.userId,
      this.clinicId,
      this.medicalId,
      obj.id,
      newPurchase
    )
    .then(() => {
      this.getPurchaseData();
      this.getStockData();
    });
}
      if (result?.event === 'Delete') {
        this.firebaseCollectionService.deletepurchase(this.userId, this.clinicId,this.medicalId, obj.id);
        this.getPurchaseData();
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

filedownload() {
 if (!this.dataSource.data || this.dataSource.data.length === 0) {
    alert('No purchase data found for selected date range');
    return;
  }

  const doc = new jsPDF();

  // Selected Dates
  const startDate = this.datePurchaseListForm.value.start
    ? new Date(this.datePurchaseListForm.value.start).toLocaleDateString('en-GB')
    : '';

  const endDate = this.datePurchaseListForm.value.end
    ? new Date(this.datePurchaseListForm.value.end).toLocaleDateString('en-GB')
    : '';

    const grandTotal = this.dataSource.data.reduce(
  (sum: number, element: any) => sum + this.getTotal(element),
  0
);

  // Title
  doc.setFontSize(16);
  doc.text('Purchase Report', 14, 15);

  // Date Range
  doc.setFontSize(11);
  doc.text(`Date : ${startDate} To ${endDate}`, 14, 25);

  // total Amount
 doc.text(`Total Amount : ${grandTotal}`, 160, 25);

  const tableData = this.dataSource.data.map((element: any, index: number) => {

    let purchaseDate = '';

    if (element.purchaseDate?.toDate) {
      purchaseDate = element.purchaseDate.toDate().toLocaleDateString('en-GB');
    }

    return [
      index + 1,
      purchaseDate,
      element.supplierName || '',
      element.mobileNumber || '',
      this.getTotal(element)
    ];
  });

  autoTable(doc, {
    head: [['No.', 'Purchase Date', 'Supplier Name', 'Mobile Number', 'Total']],
    body: tableData,
    startY: 30,
    styles: {
      fontSize: 10
    },
    headStyles: {
      fillColor: [41, 128, 185]
    }
  });

  doc.save('purchase-report.pdf');
}

}
