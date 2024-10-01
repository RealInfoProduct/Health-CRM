import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddmedicaldialogComponent } from './addmedicaldialog/addmedicaldialog.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';

export interface Employee {
  id: number;
  Name: string;
  ownerName: string;
  mobileNumber: number;
  middleEmail: string;
  address: string;
}

export interface medicaldata {
  id: number,
  firstName: string,
  middleName: string,
  lastName: string,
  medicalName: string,
  mobileNumber: number,
  middleEmail: string,
  address: string
}
@Component({
  selector: 'app-medical',
  templateUrl: './medical.component.html',
  styleUrls: ['./medical.component.scss']
})
export class MedicalComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;

  medicalColumns: string[] = [
    'id',
    'medicalName',
    'ownerName',
    'mobileNumber',
    'middleEmail',
    'address',
    'action'
  ];

  medicallist = [
    {
      id: 1,
      firstName: "ravi",
      middleName: "ravi",
      lastName: "patel",
      medicalName: "Abacavir",
      mobileNumber: 9876543485,
      middleEmail: 'Abacavir@gmail.com',
      address: "Vip Road Surat"
    }
  ]
  
  dataSource = new MatTableDataSource(this.medicallist);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(public dialog: MatDialog, public datePipe: DatePipe) { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AddmedicaldialogComponent, {
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

  addRowData(row_obj: medicaldata): void {
    this.medicallist.push(
      {
        id: this.medicallist.length + 1,
        firstName: row_obj.firstName,
        middleName: row_obj.middleName,
        lastName: row_obj.lastName,
        medicalName: row_obj.medicalName,
        mobileNumber: row_obj.mobileNumber,
        middleEmail: row_obj.middleEmail,
        address: row_obj.address
      });
    this.dataSource = new MatTableDataSource(this.medicallist);
    this.table.renderRows();
  }

  updateRowData(row_obj: medicaldata): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value: any) => {
      if (value.id === row_obj.id) {
        value.firstName = row_obj.firstName;
        value.middleName = row_obj.middleName;
        value.lastName = row_obj.lastName;
        value.medicalName = row_obj.medicalName;
        value.mobileNumber = row_obj.mobileNumber;
        value.middleEmail = row_obj.middleEmail;
        value.address = row_obj.address;
      }
      return true;
    });
  }

  deleteRowData(row_obj: medicaldata): boolean | any {
    const allMedicallistData = this.medicallist
    this.medicallist = allMedicallistData.filter((id: any) => id.id !== row_obj.id)
    this.dataSource = new MatTableDataSource(this.medicallist)
  }


}
