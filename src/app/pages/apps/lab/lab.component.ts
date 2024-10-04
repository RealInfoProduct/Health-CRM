import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddlabdialogComponent } from './addlabdialog/addlabdialog.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

export interface laboratorydata {
  id: number,
  reportType: string,
  reportName: string,
  reportFee: number,
  disease: string,
}
@Component({
  selector: 'app-lab',
  templateUrl: './lab.component.html',
  styleUrls: ['./lab.component.scss']
})
export class LabComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  labColumns: string[] = [
    'id',
    'reportType',
    'reportName',
    'reportFee',
    'disease',
    'action'
  ];

  lablist = [
    {
      id: 1,
      reportType: "aa",
      reportName: "aa",
      reportFee: 150,
      disease: "Fever"
    }
  ]

  dataSource = new MatTableDataSource(this.lablist)
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;

  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AddlabdialogComponent, {
      data: obj,
      width: action === 'Delete' ? '25%' : '50%'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.addRowData(result.data);
      } else if (result.event === 'Update') {
        this.updateRowData(result.data);
      } else if (result.event === 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(row_obj: laboratorydata): void {
    this.lablist.push(
      {
        id: this.lablist.length + 1,
        reportType: row_obj.reportType,
        reportName: row_obj.reportName,
        reportFee: row_obj.reportFee,
        disease: row_obj.disease,
      });
    this.dataSource = new MatTableDataSource(this.lablist);
    this.table.renderRows();
    // this.dialog.open(OkAppTaskComponent);
  }

  updateRowData(row_obj: laboratorydata): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value: any) => {
      if (value.id === row_obj.id) {
        value.reportType = row_obj.reportType;
        value.reportName = row_obj.reportName;
        value.reportFee = row_obj.reportFee;
        value.disease = row_obj.disease;
      }
      return true;
    });
  }

  deleteRowData(row_obj: laboratorydata): boolean | any {
    const allLablistData = this.lablist
    this.lablist = allLablistData.filter((id: any) => id.id !== row_obj.id)
    this.dataSource = new MatTableDataSource(this.lablist)
  }
}
