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

export class LabComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;

  labColumns: string[] = [
    'id',
    'patientName',
    'laboratoryName',
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
  appointmentslist: any = []
  laboratorylist: any = []

  dataSource = new MatTableDataSource(this.lablist)
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    public dialog: MatDialog,
    private firebaseCollectionService: FirebaseCollectionService
  ) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getlabdata()
    this.getappointmentdata()
    this.getlaboratoryData()
  }

  getappointmentdata() {
    this.firebaseCollectionService.getDocuments('Doctor', 'appointmentslist').then((appointment) => {
      this.appointmentslist = appointment
      console.log('this.appointmentslist=====',this.appointmentslist);
    }).catch((error) => {
      console.error('Error fetching laboratory:', error);
    });
  }

  getlaboratoryData() {
    this.firebaseCollectionService.getDocuments('Doctor', 'laboratorylist').then((laboratory) => {
      this.laboratorylist = laboratory
    }).catch((error) => {
      console.error('Error fetching laboratory:', error);
    });
  }


  getlabdata() {
    this.firebaseCollectionService.getDocuments('Doctor', 'lablist').then((lab) => {
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
        this.firebaseCollectionService.addDocument('Doctor', result.data, 'lablist');
        this.getlabdata()
      } else if (result.event === 'Update') {
        this.lablist.forEach((element: any) => {
          if (obj.id === element.id) {
            this.firebaseCollectionService.updateDocument('Doctor', obj.id, result.data, 'lablist');
            this.getlabdata()
          }
        });
      } else if (result.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('Doctor', obj.id, 'lablist');
        this.getlabdata()
      }
    });
  }

  getAppointmentlist(appointmentId: string): string {  
    return this.appointmentslist.find((appointmentObj:any) => appointmentObj.id === appointmentId)?.firstName  ;
  }

  getlaboratorylist(laboratoryId: string): string {  
    return this.laboratorylist.find((laboratoryObj:any) => laboratoryObj.id === laboratoryId)?.laboratoryName ;
  }
  
}
