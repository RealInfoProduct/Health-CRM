import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddlabdialogComponent } from './addlabdialog/addlabdialog.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-lab',
  templateUrl: './lab.component.html',
  styleUrls: ['./lab.component.scss']
})

export class LabComponent {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;

  labColumns: string[] = [
    'id',
    'patientName',
    'mobileNumber',
    'age',
    'gender',
    'reportType',
    'reportName',
    'reportFee',
    'disease',
    'action'
  ];

  lablist: any = []

  dataSource = new MatTableDataSource(this.lablist)
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    public dialog: MatDialog,
    private firebaseCollectionService: FirebaseCollectionService
  ) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getlabdata()
  }

  getlabdata() {
    this.firebaseCollectionService.getDocuments('ClinicList', 'lablist').then((lab) => {
      this.lablist = lab
      if (lab && lab.length > 0) {
        this.dataSource = new MatTableDataSource(this.lablist)
        this.dataSource.paginator = this.paginator
      } else {
        this.lablist = []
        this.dataSource = new MatTableDataSource(this.lablist)
        this.dataSource.paginator = this.paginator
      }
    })
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openLabDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AddlabdialogComponent, {
      data: obj,
      width: action === 'Delete' ? '25%' : '50%'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.firebaseCollectionService.addDocument('ClinicList', result.data, 'lablist');
        this.getlabdata()
      } else if (result.event === 'Update') {
        this.lablist.forEach((element: any) => {
          if (obj.id === element.id) {
            this.firebaseCollectionService.updateDocument('ClinicList', obj.id, result.data, 'lablist');
            this.getlabdata()
          }
        });
      } else if (result.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('ClinicList', obj.id, 'lablist');
        this.getlabdata()
      }
    });
  }

}
