import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Timestamp } from 'firebase/firestore';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { ClicnkDialogComponent } from './clicnk-dialog/clicnk-dialog.component';

@Component({
  selector: 'app-clicnk',
  templateUrl: './clicnk.component.html',
  styleUrls: ['./clicnk.component.scss']
})
export class ClicnkComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;

  doctorsColumns: string[] = [
    'id',
    'clicnkName',
    'doctorsName',
    'degree',
    'mobileNumber',
    'email',
    'address',
    'userName',
    'password',
    'action'
  ]

   clinicList: any = []
   userList:any =[]

  userType:any = localStorage.getItem('usertype')
  userId:any = localStorage.getItem('userId')
  
  dataSource = new MatTableDataSource(this. clinicList)
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    public dialog: MatDialog,
    private firebaseCollectionService: FirebaseCollectionService
  ) { }

  convertTimestamp(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }


  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getclicnkdata()
    this.getuserdata()
  }

  getclicnkdata() {
    this.firebaseCollectionService.getDocuments('Admin', 'clinicList').then((clicnk) => {  
      this. clinicList = clicnk
      if (clicnk && clicnk.length > 0) {
        this.dataSource = new MatTableDataSource(this. clinicList)
        
        this.dataSource.paginator = this.paginator
      } else {
        this. clinicList = []
        this.dataSource = new MatTableDataSource(this. clinicList)
        this.dataSource.paginator = this.paginator
      }
    })
  }

   getuserdata(){
    this.firebaseCollectionService.getDocuments('Admin', 'userlist').then((user) => {
      if(user && user.length >0) {
        this.userList = user 
        console.log(this.userList);
      }

    })
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDoctorsDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(ClicnkDialogComponent, {
      data: obj,
      width: action === 'Delete' ? '25%' : '50%'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {

        this.firebaseCollectionService
          .addDocument('Admin', result.data, 'clinicList')
          .then((res: any) => {

            console.log(res); // check firebase response

            const payload = {
              id: "",
              userName: result.data.userName,
              password: result.data.password,
              userId: result.data.userId,
              clinicId: res.id, // firebase generated id
              userType: "Clinic"
            };

            this.firebaseCollectionService
              .addDocument('Admin', payload, 'userlist')
              .then(() => {
                this.getclicnkdata();
                this.getuserdata();
              });

          })
          .catch((error: any) => {
            console.log(error);
          });

      } else if (result.event === 'Update') {
        this.clinicList.forEach((element: any) => {
          if (obj.id === element.id) {
            this.firebaseCollectionService.updateDocument('Admin', obj.id, result.data, 'clinicList');
            this.getclicnkdata()
          }
        });
      } else if (result.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('Admin', obj.id, 'clinicList');
        this.getclicnkdata()
      }

    })
  }

}
