import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-medical-view',
  templateUrl: './medical-view.component.html',
  styleUrls: ['./medical-view.component.scss']
})
export class MedicalViewComponent implements OnInit {
     displayedColumns: string[] = [
     'srno',
     'date',
     'medicineName',
     'CompanyName',
     'category',
     'qty',
     'time',
     'mealTiming',
   ];
 
    viewMedical :any = []
     viewMedicalDataSource = new MatTableDataSource<any>();
     
   @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
   @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
 
   constructor(
      public dialogRef: MatDialogRef<MedicalViewComponent>,
         @Optional() @Inject(MAT_DIALOG_DATA) public data: any
   ){
     this.viewMedical = { ...data };
   }
 
 
   ngOnInit(): void {
      const details = this.viewMedical;
   const tableData = details.medical.map((p: any) => ({
     ...p,
   }));
 
   this.viewMedicalDataSource = new MatTableDataSource(tableData);
       
   }
 
   ngAfterViewInit() {
   this.viewMedicalDataSource.paginator = this.paginator;
 }
 
 closeDialog() {
     this.dialogRef.close({ event: 'Cancel' });
   }
 }
 