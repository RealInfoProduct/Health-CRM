import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-laboratory-view',
  templateUrl: './laboratory-view.component.html',
  styleUrls: ['./laboratory-view.component.scss']
})
export class LaboratoryViewComponent implements OnInit {
    displayedColumns: string[] = [
    'srno',
    'date',
    'reportName',
    'reportType',
    'disease',
  ];

   viewLaboratory :any = []
    viewLaboratoryDataSource = new MatTableDataSource<any>();
    
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
     public dialogRef: MatDialogRef<LaboratoryViewComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.viewLaboratory = { ...data };
  }


  ngOnInit(): void {
     const details = this.viewLaboratory;
  const tableData = details.reports.map((p: any) => ({
    ...p,
  }));

  this.viewLaboratoryDataSource = new MatTableDataSource(tableData);
      
  }

  ngAfterViewInit() {
  this.viewLaboratoryDataSource.paginator = this.paginator;
}

closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
