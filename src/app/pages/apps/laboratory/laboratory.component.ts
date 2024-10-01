import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AddlaboratorydialogComponent } from './addlaboratorydialog/addlaboratorydialog.component';

export interface laboratorydata {
  id: number,
  firstName: string,
  middleName: string,
  lastName: string,
  laboratorylName: string,
  mobileNumber: number,
  laboratorylEmail: string,
  address: string
}

@Component({
  selector: 'app-laboratory',
  templateUrl: './laboratory.component.html',
  styleUrls: ['./laboratory.component.scss']
})
export class LaboratoryComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  laboratoryColumns: string[] = [
    'id',
    'laboratorylName',
    'ownerName',
    'mobileNumber',
    'laboratorylEmail',
    'address',
    'action'
  ];

  laboratorylist = [
    {
      id: 1,
      firstName: "ravi",
      middleName: "ravi",
      lastName: "patel",
      laboratorylName: "Abacavir",
      mobileNumber: 9876543485,
      laboratorylEmail: 'Abacavir@gmail.com',
      address: "Vip Road Surat"
    }
  ]

  dataSource = new MatTableDataSource(this.laboratorylist)
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
    const dialogRef = this.dialog.open(AddlaboratorydialogComponent, {
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
    this.laboratorylist.push(
      {
        id: this.laboratorylist.length + 1,
        firstName: row_obj.firstName,
        middleName: row_obj.middleName,
        lastName: row_obj.lastName,
        laboratorylName: row_obj.laboratorylName,
        mobileNumber: row_obj.mobileNumber,
        laboratorylEmail: row_obj.laboratorylEmail,
        address: row_obj.address
      });
    this.dataSource = new MatTableDataSource(this.laboratorylist);
    this.table.renderRows();
  }

  updateRowData(row_obj: laboratorydata): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value: any) => {
      if (value.id === row_obj.id) {
        value.firstName = row_obj.firstName;
        value.middleName = row_obj.middleName;
        value.lastName = row_obj.lastName;
        value.laboratorylName = row_obj.laboratorylName;
        value.mobileNumber = row_obj.mobileNumber;
        value.laboratorylEmail = row_obj.laboratorylEmail;
        value.address = row_obj.address;
      }
      return true;
    });
  }

  deleteRowData(row_obj: laboratorydata): boolean | any {
    const allLaboratorylistData = this.laboratorylist
    this.laboratorylist = allLaboratorylistData.filter((id: any) => id.id !== row_obj.id)
    this.dataSource = new MatTableDataSource(this.laboratorylist)
  }

}
