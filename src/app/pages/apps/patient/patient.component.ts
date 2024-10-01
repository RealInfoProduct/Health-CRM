import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { PatientDialogComponent } from './patient-dialog/patient-dialog.component';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  PatientColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'mobileNumber',
    'address',
    'bloodGroup',
    'dob',
    'age',
    'gender',
    'action'
  ];

  PatientData = [
    {
      id: 1,
      firstName: "demo",
      lastName: "demo2",
      mobileNumber: 9821763484,
      address: "silver ",
      bloodGroup: "o+",
      dob: "2018-10-27T18:30:00.000Z",
      age: 5,
      gender: "male"
    }
  ]

  dataSource = new MatTableDataSource(this.PatientData)
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(public dialog: MatDialog,) { }

  ngOnInit(): void { }

  addPatient(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(PatientDialogComponent, {
      data: obj,
      width: action === 'Delete' ? '25%' : '50%'
    })
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.PatientData.push({
          id: this.PatientData.length + 1,
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          mobileNumber: result.data.mobileNumber,
          address: result.data.address,
          bloodGroup: result.data.bloodGroup,
          dob: result.data.dob,
          age: result.data.age,
          gender: result.data.gender
        })
        this.dataSource = new MatTableDataSource(this.PatientData)
      }
      if (result.event === 'Edit') {
        this.PatientData.forEach((element: any) => {
          if (element.id === result.data.id) {
            element.id = result.data.id
            element.firstName = result.data.firstName
            element.lastName = result.data.lastName
            element.mobileNumber = result.data.mobileNumber
            element.address = result.data.address
            element.bloodGroup = result.data.bloodGroup
            element.dob = result.data.dob
            element.age = result.data.age
            element.gender = result.data.gender
          }
        })
        this.dataSource = new MatTableDataSource(this.PatientData)
      }
      if (result?.event === 'Delete') {
        const allPatientData = this.PatientData
        this.PatientData = allPatientData.filter((id: any) => id.id !== result.data.id)
        this.dataSource = new MatTableDataSource(this.PatientData);
      }
    });
  }
}
