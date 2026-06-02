import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdddoctorsdialogComponent } from './adddoctorsdialog/adddoctorsdialog.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';


@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.scss']
})
export class DoctorsComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;

  doctorsColumns: string[] = [
    'id',
    'doctorsName',
    'department',
    'mobileNumber',
    'degree',
    'experience',
    'consultationFee',
    'email',
    'joiningDate',
    'userName',
    'password',
    'action'
  ]

  doctorslist: any = []
  userList: any = []

  userId = localStorage.getItem('userId')
  clinicId = localStorage.getItem('clinicId')
  userType:any = localStorage.getItem('usertype')
  
  dataSource = new MatTableDataSource(this.doctorslist)
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
    if(this.userType === 'Patient'){
      this.doctorsColumns = this.doctorsColumns.filter(column =>column !== 'action' )
    }
    this.dataSource.paginator = this.paginator;
    this.getdoctorsdata()
    this.getuserdata()
  }


  getdoctorsdata() {
    this.firebaseCollectionService.getDoctors(this.userId, this.clinicId,'doctorsList').then((doctors) => {  
      this.doctorslist = doctors
      if (doctors && doctors.length > 0) {
        this.dataSource = new MatTableDataSource(this.doctorslist)
        
        this.dataSource.paginator = this.paginator
      } else {
        this.doctorslist = []
        this.dataSource = new MatTableDataSource(this.doctorslist)
        this.dataSource.paginator = this.paginator
      }
    })
  }


  getuserdata(){
    this.firebaseCollectionService.getDocuments('Admin', 'userlist').then((user) => {
      if(user && user.length >0) {
        this.userList = user 
      }

    })
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDoctorsDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AdddoctorsdialogComponent, {
      data: obj,
      width: action === 'Delete' ? '25%' : '50%'
    });
     dialogRef.afterClosed().subscribe(async (result) => {
      if (result?.event === 'Add') {
        const doctorId = await this.firebaseCollectionService.addDoctor(this.userId, this.clinicId, result.data);
        const payloda = {
          id: "",
          doctors: doctorId,
          userName: result.data.userName,
          password: result.data.password,
          userId: localStorage.getItem("userId"),
          clinicId: localStorage.getItem("clinicId"),
          userType: "Doctor"
        }
        this.firebaseCollectionService.addDocument('Admin', payloda, 'userlist');
        this.getdoctorsdata()
        this.getuserdata()

      } else if (result.event === 'Update') {
        this.doctorslist.forEach((element: any) => {
          if (obj.id === element.id) {
            this.firebaseCollectionService.updateDoctor(this.userId, this.clinicId, obj.id, result.data);
            this.getdoctorsdata()
          }
        });
      } else if (result.event === 'Delete') {
        this.firebaseCollectionService.deleteDoctor(this.userId, this.clinicId, obj.id);
        this.getdoctorsdata()
      }

    })
  }
}
