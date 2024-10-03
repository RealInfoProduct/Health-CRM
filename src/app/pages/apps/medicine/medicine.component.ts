import { Component, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MedicineDialogComponent } from './medicine-dialog/medicine-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-medicine',
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.scss']
})
export class MedicineComponent {

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  medicineColumns: string[] = [
    'id',
    'medicineName',
    'companyName',
    'dosage',
    'price',
    'action'
  ];

  medicinelist: any = []

  dataSource = new MatTableDataSource(this.medicinelist);
  constructor(public dialog: MatDialog) { }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(MedicineDialogComponent, {
      data: obj,
      width: action === 'Delete' ? '25%' : '50%'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.medicinelist.push({
          id: this.medicinelist.length + 1,
          medicineName: result.data.medicineName,
          companyName: result.data.companyName,
          dosage: result.data.dosage,
          price: result.data.price
        })
        this.dataSource = new MatTableDataSource(this.medicinelist)
      }
      if (result.event === 'Update') {
        this.medicinelist.forEach((element: any) => {
          if (element.id === result.data.id) {
            element.id = result.data.id
            element.medicineName = result.data.medicineName
            element.companyName = result.data.companyName
            element.dosage = result.data.dosage
            element.price = result.data.price
          }
        })
        this.dataSource = new MatTableDataSource(this.medicinelist)
      }
      if (result.event === 'Delete') {
        const allMedicinelist = this.medicinelist
        this.medicinelist = allMedicinelist.filter((id: any) => id.id !== result.data.id)
        this.dataSource = new MatTableDataSource(this.medicinelist);
      }
    });
  }
}
