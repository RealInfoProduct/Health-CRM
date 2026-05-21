import { Component, OnInit, ViewChild } from '@angular/core';
import { ReceptionistDialogComponent } from './receptionist-dialog/receptionist-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-receptionist',
  templateUrl: './receptionist.component.html',
  styleUrls: ['./receptionist.component.scss']
})
export class ReceptionistComponent implements OnInit{
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;

  receptionistColumns: string[] = [
    'id',
    'ownerName',
    'mobileNumber',
    'middleEmail',
    'address',
    'userName',
    'password',
    'action'
  ];

  receptionistList: any = []
  userList: any = []
  originalReceptionist: any = [];

  dataSource = new MatTableDataSource(this.receptionistList);
  userId = localStorage.getItem('userId')
  clinicId = localStorage.getItem('clinicId')
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    public dialog: MatDialog,
    private firebaseCollectionService: FirebaseCollectionService) { }

    ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getReceptionistData()
    this.getuserdata()
  }

  getReceptionistData() {
    this.firebaseCollectionService.getReceptionist(this.userId, this.clinicId,'Receptionistlist').then((receptionist) => {  
      this.receptionistList = receptionist
       this.originalReceptionist = receptionist;
      if (receptionist && receptionist.length > 0) {
        this.dataSource = new MatTableDataSource(this.receptionistList);
        this.dataSource.paginator = this.paginator;
      } else {
        this.receptionistList = [];
        this.dataSource = new MatTableDataSource(this.receptionistList);
        this.dataSource.paginator = this.paginator;
      }
    }).catch((error) => {
      console.error('Error fetching receptionist:', error);
    });
  }

    getuserdata(){
    this.firebaseCollectionService.getDocuments('Admin', 'userlist').then((user) => {
      if(user && user.length >0) {
        this.userList = user 
      }

    })
  }


  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openMedicalDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(ReceptionistDialogComponent, {
      data: obj,
      width: action === 'Delete' ? '25%' : '50%'
    });
    dialogRef.afterClosed().subscribe(async(result) => {
      if (result?.event === 'Add') {
        const receptionistId = await this.firebaseCollectionService.addReceptionist(this.userId, this.clinicId, result.data);
        
        const payloda = {
          id:"",
          receptionist:receptionistId,
           userName:result.data.userName,
           password:result.data.password,
           userId:localStorage.getItem("userId"),
           clinicId:localStorage.getItem("clinicId"),
           userType:"Receptionist"
        }
         this.firebaseCollectionService.addDocument('Admin',  payloda,'userlist');
        this.getReceptionistData()
        this.getuserdata()
      }
      if (result?.event === 'Update') {
        this.receptionistList.forEach((element: any) => {
          if (obj.id === element.id) {
            this.firebaseCollectionService.updateReceptionist(this.userId, this.clinicId, obj.id, result.data);
            this.getReceptionistData()
          }
        });
      }
      if (result?.event === 'Delete') {
        this.firebaseCollectionService.deleteReceptionist(this.userId, this.clinicId, obj.id);
        this.getReceptionistData()
      }
    });
  }
}
