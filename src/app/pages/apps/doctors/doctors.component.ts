import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdddoctorsdialogComponent } from './adddoctorsdialog/adddoctorsdialog.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';
import { log } from 'node:console';

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
    'availability',
    'mobileNumber',
    'degree',
    'experience',
    'consultationFee',
    'email',
    'rating',
    'clinicLocation',
    'joiningDate',
    'action'
  ]

  doctorslist: any = []

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
  }

  // getdoctorsdata() {
  //   this.firebaseCollectionService.getDocuments('ClinicList', 'doctorslist').then((doctors) => {  
  //     this.doctorslist = doctors
  //     if (doctors && doctors.length > 0) {
  //       this.dataSource = new MatTableDataSource(this.doctorslist)
        
  //       this.dataSource.paginator = this.paginator
  //     } else {
  //       this.doctorslist = []
  //       this.dataSource = new MatTableDataSource(this.doctorslist)
  //       this.dataSource.paginator = this.paginator
  //     }
  //   })
  // }


  getdoctorsdata() {
    this.firebaseCollectionService.getDocuments('Doctor', 'doctorslist').then((doctors) => {  
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
    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result.event === 'Add') {
    //     this.firebaseCollectionService.addDocument('Doctor', result.data, 'doctorslist');
    //     this.getdoctorsdata()

    //   } else if (result.event === 'Update') {
    //     this.doctorslist.forEach((element: any) => {
    //       if (obj.id === element.id) {
    //         this.firebaseCollectionService.updateDocument('Doctor', obj.id, result.data, 'doctorslist');
    //         this.getdoctorsdata()
    //       }
    //     });
    //   } else if (result.event === 'Delete') {
    //     this.firebaseCollectionService.deleteDocument('Doctor', obj.id, 'doctorslist');
    //     this.getdoctorsdata()
    //   }

    // })

     dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.firebaseCollectionService.addDocument('Doctor', result.data, 'doctorslist');
        this.getdoctorsdata()

      } else if (result.event === 'Update') {
        this.doctorslist.forEach((element: any) => {
          if (obj.id === element.id) {
            this.firebaseCollectionService.updateDocument('Doctor', obj.id, result.data, 'doctorslist');
            this.getdoctorsdata()
          }
        });
      } else if (result.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('Doctor', obj.id, 'doctorslist');
        this.getdoctorsdata()
      }

    })
  }
}
