import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddmedicaldialogComponent } from './addmedicaldialog/addmedicaldialog.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

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
export class MedicalComponent {
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

  medicallist:any = []
  
  dataSource = new MatTableDataSource(this.medicallist);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    public dialog: MatDialog,
    private firebaseCollectionService : FirebaseCollectionService) { }

  

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getMedicalData()
  }

  getMedicalData() {
    this.firebaseCollectionService.getDocuments('ClinicList', 'medicallist').then((medical) => {
      this.medicallist = medical
      if (medical && medical.length > 0) {
        this.dataSource = new MatTableDataSource(this.medicallist);
      } else {
        this.medicallist = [];
        this.dataSource = new MatTableDataSource(this.medicallist);
      }
    }).catch((error) => {
      console.error('Error fetching medical:', error);
    });
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
      if (result?.event === 'Add') {
        this.firebaseCollectionService.addDocument('ClinicList', result.data, 'medicallist');
        this.getMedicalData()
      }
      if (result?.event === 'Update') {
        this.medicallist.forEach((element: any) => {
          if (obj.id === element.id) {
            this.firebaseCollectionService.updateDocument('ClinicList', obj.id, result.data, 'medicallist');
            this.getMedicalData()
          }
        });
      }
      if (result?.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('ClinicList', obj.id, 'medicallist');
        this.getMedicalData()
      }
    });
  }
}
