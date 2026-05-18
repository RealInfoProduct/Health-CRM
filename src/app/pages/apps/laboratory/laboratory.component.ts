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
    'userName',
    'password',
    'action'
  ];

  laboratorylist: any = []
    userList: any = []

  dataSource = new MatTableDataSource(this.laboratorylist)
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

         userId = localStorage.getItem('userId')
         clinicId = localStorage.getItem('clinicId')
  constructor(
    public dialog: MatDialog,
    private firebaseCollectionService: FirebaseCollectionService
  ) { }

 ngOnInit(): void {
  this.dataSource.paginator = this.paginator;

  this.dataSource.filterPredicate = (data: any, filter: string) => {
    const laboratoryName = (data.laboratoryName || '').toLowerCase();
    return (
      laboratoryName.includes(filter)
    );
  };

  this.getlaboratoryData();
  this.getuserdata()
}

  getlaboratoryData() {
    const userId = localStorage.getItem('userId')
     const clinicId = localStorage.getItem('clinicId')
    this.firebaseCollectionService.getlaboratory(userId, clinicId, 'laboratorylist').then((laboratory) => { 
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

    getuserdata(){
    this.firebaseCollectionService.getDocuments('Admin', 'userlist').then((user) => {
      if(user && user.length >0) {
        this.userList = user 
      }

    })
  }


  // applyFilter(filterValue: string): void {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

  openLaboratoryDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AddlaboratorydialogComponent, {
      data: obj,
      width: action === 'Delete' ? '25%' : '50%'
    });
    dialogRef.afterClosed().subscribe(async(result) => {
      if (result?.event === 'Add') {
         const laboratoryId = await this.firebaseCollectionService.addlaboratory(this.userId,this.clinicId,result.data);
          const payloda = {
          id:"",
         laboratory:laboratoryId,
           userName:result.data.userName,
           password:result.data.password,
           userId:localStorage.getItem("userId"),
           clinicId:localStorage.getItem("clinicId"),
           userType:"Laboratory"
        }
         this.firebaseCollectionService.addDocument('Admin',  payloda,'userlist');
        this.getlaboratoryData()
         this.getuserdata()
      }
      if (result?.event === 'Update') {
        this.laboratorylist.forEach((element: any) => {
          if (obj.id === element.id) {
            this.firebaseCollectionService.updatelaboratory(this.userId,this.clinicId, obj.id, result.data);
            this.getlaboratoryData()
          }
        });
      }
      if (result?.event === 'Delete') {
        this.firebaseCollectionService.deletelaboratory(this.userId,this.clinicId, obj.id);
        this.getlaboratoryData()
      }
    });
  }

}
