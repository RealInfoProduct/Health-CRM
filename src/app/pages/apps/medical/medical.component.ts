import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddmedicaldialogComponent } from './addmedicaldialog/addmedicaldialog.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-medical',
  templateUrl: './medical.component.html',
  styleUrls: ['./medical.component.scss']
})
export class MedicalComponent implements OnInit{
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;

  medicalColumns: string[] = [
    'id',
    'medicalName',
    'ownerName',
    'mobileNumber',
    'middleEmail',
    'address',
    'userName',
    'password',
    'action'
  ];

  medicallist: any = []
  userList: any = []

  dataSource = new MatTableDataSource(this.medicallist);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor
  (
    public dialog: MatDialog,
    private firebaseCollectionService: FirebaseCollectionService
  ) { }

    ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getMedicalData()
    this.getuserdata()
  }

  getMedicalData() {
     const userId = localStorage.getItem('userId')
     const clinicId = localStorage.getItem('clinicId')
    this.firebaseCollectionService.getMedical(userId, clinicId,'medicallist').then((medical) => {  
      this.medicallist = medical
      if (medical && medical.length > 0) {
        this.dataSource = new MatTableDataSource(this.medicallist);
        this.dataSource.paginator = this.paginator;
      } else {
        this.medicallist = [];
        this.dataSource = new MatTableDataSource(this.medicallist);
        this.dataSource.paginator = this.paginator;
      }
    }).catch((error) => {
      console.error('Error fetching medical:', error);
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
    const dialogRef = this.dialog.open(AddmedicaldialogComponent, {
      data: obj,
      width: action === 'Delete' ? '25%' : '50%'
    });
    dialogRef.afterClosed().subscribe(async(result) => {
      if (result?.event === 'Add') {
        const userId = localStorage.getItem('userId')
        const clinicId = localStorage.getItem('clinicId')
        const MedicalId = await  this.firebaseCollectionService.addMedical(userId, clinicId, result.data);
          const payloda = {
          id:"",
         Medical:MedicalId,
           userName:result.data.userName,
           password:result.data.password,
           userId:localStorage.getItem("userId"),
           clinicId:localStorage.getItem("clinicId"),
           userType:"Medical"
        }
         this.firebaseCollectionService.addDocument('Admin',  payloda,'userlist');
        this.getMedicalData()
        this.getuserdata()
      }
      if (result?.event === 'Update') {
        this.medicallist.forEach((element: any) => {
          if (obj.id === element.id) {
            const userId = localStorage.getItem('userId')
            const clinicId = localStorage.getItem('clinicId')
            this.firebaseCollectionService.updateMedical(userId, clinicId, obj.id, result.data);
            this.getMedicalData()
          }
        });
      }
      if (result?.event === 'Delete') {
         const userId = localStorage.getItem('userId')
        const clinicId = localStorage.getItem('clinicId')
        this.firebaseCollectionService.deleteMedical(userId, clinicId, obj.id);
        this.getMedicalData()
      }
    });
  }
}
