import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AddlaboratorydialogComponent } from './addlaboratorydialog/addlaboratorydialog.component';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-laboratory',
  templateUrl: './laboratory.component.html',
  styleUrls: ['./laboratory.component.scss']
})
export class LaboratoryComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  laboratoryColumns: string[] = [
    'id',
    'laboratoryName',
    'ownerName',
    'mobileNumber',
    'laboratoryEmail',
    'address',
    'action'
  ];

  laboratorylist: any = []

  dataSource = new MatTableDataSource(this.laboratorylist)
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);


  constructor(
    public dialog: MatDialog,
    private firebaseCollectionService: FirebaseCollectionService
  ) { }

  ngOnInit(): void { 
    this.dataSource.paginator = this.paginator;
    this.getlaboratoryData()
  }

  getlaboratoryData() {
    this.firebaseCollectionService.getDocuments('Doctor', 'laboratorylist').then((laboratory) => {
      this.laboratorylist = laboratory
      if (laboratory && laboratory.length > 0) {
        this.dataSource = new MatTableDataSource(this.laboratorylist);
        this.dataSource.paginator = this.paginator;
      } else {
        this.laboratorylist = [];
        this.dataSource = new MatTableDataSource(this.laboratorylist);
        this.dataSource.paginator = this.paginator;
      }
    }).catch((error) => {
      console.error('Error fetching laboratory:', error);
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openLaboratoryDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AddlaboratorydialogComponent, {
      data: obj,
      width: action === 'Delete' ? '25%' : '50%'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.firebaseCollectionService.addDocument('Doctor', result.data, 'laboratorylist');
        this.getlaboratoryData()
      }
      if (result?.event === 'Update') {
        this.laboratorylist.forEach((element: any) => {
          if (obj.id === element.id) {
            this.firebaseCollectionService.updateDocument('Doctor', obj.id, result.data, 'laboratorylist');
            this.getlaboratoryData()
          }
        });
      }
      if (result?.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('Doctor', obj.id, 'laboratorylist');
        this.getlaboratoryData()
      }
    });
  }

}
