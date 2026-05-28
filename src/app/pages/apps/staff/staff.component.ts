import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StaffDialogComponent } from './staff-dialog/staff-dialog.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  StaffColumns: string[] = [
    'id',
    'staffName',
    'designation',
    'mobileNumber',
    'email',
    'joiningDate',
    'salary',
    'status',
    'shift',
    'experience',
    'gender',
    'address',
    'action'
  ]

  stafflist: any = []

  dataSource = new MatTableDataSource(this.stafflist)

  convertTimestamp(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(
    public dialog: MatDialog,
    private firebaseCollectionService: FirebaseCollectionService
  ) { }

  ngOnInit(): void {
    this.getStaffData()
  }

  getStaffData() {
    this.firebaseCollectionService.getDocuments('clinicList', 'stafflist').then((staff) => {
      this.stafflist = staff
      if (staff && staff.length > 0) {
        this.dataSource = new MatTableDataSource(this.stafflist);
        this.dataSource.paginator = this.paginator
      } else {
        this.stafflist = [];
        this.dataSource = new MatTableDataSource(this.stafflist);
        this.dataSource.paginator = this.paginator
      }
    }).catch((error) => {
      console.error('Error fetching laboratory:', error);
    });
  }

  openStaffDialog(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(StaffDialogComponent, {
      data: obj,
      width: action === 'Delete' ? '25%' : '50%'
    })
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.firebaseCollectionService.addDocument('clinicList', result.data, 'stafflist')
        this.getStaffData()
      }
      if (result?.event === 'Update') {
        this.stafflist.forEach((element: any) => {
          if (obj.id === element.id) {
            this.firebaseCollectionService.updateDocument('clinicList', obj.id, result.data, 'stafflist');
            this.getStaffData()
          }
        })
      }
      if (result?.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('clinicList', obj.id, 'stafflist');
        this.getStaffData()
      }
    })
  }

}
