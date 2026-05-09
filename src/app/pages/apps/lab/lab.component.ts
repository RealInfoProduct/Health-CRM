import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddlabdialogComponent } from './addlabdialog/addlabdialog.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { ReportViewComponent } from './report-view/report-view.component';

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
    'date',
    'patientName',
    'laboratoryName',
    'mobileNumber',
    'age',
    'gender',
    'action'
  ];

  lablist: any = []
  appointmentslist: any = []
  laboratorylist: any = []
  patientlist: any = []

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
    this.getPatientData()
    this.getlaboratoryData()
     this.setCustomFilter();
  }

  setCustomFilter() {
  this.dataSource.filterPredicate = (data: any, filter: string): boolean => {

    // Patient Full Name
    const patientName = this.getAppointmentlist(data.patientName)?.toLowerCase() || '';

    // Laboratory Name
    const laboratoryName = this.getlaboratorylist(data.laboratoryName)?.toLowerCase() || '';

    // Other Fields
    const searchString = `
      ${data.id}
      ${patientName}
      ${laboratoryName}
      ${data.mobileNumber}
      ${data.age}
      ${data.gender}
    `.toLowerCase();

    return searchString.includes(filter);
  };
}

  getappointmentdata() {
    this.firebaseCollectionService.getDocuments('Doctor', 'appointmentslist').then((appointment) => {
      this.appointmentslist = appointment
      console.log("this.appointmentslist",this.appointmentslist);
    }).catch((error) => {
      console.error('Error fetching laboratory:', error);
    });
  }

  getPatientData() {
    this.firebaseCollectionService.getDocuments('Doctor', 'patientlist').then((patient) => {
      if (patient && patient.length > 0) {
        this.patientlist = patient

      }
      console.log("this.patientlist", this.patientlist);
    })
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
           this.setCustomFilter();
      } else {
        this.lablist = []
        this.dataSource = new MatTableDataSource(this.lablist)
        this.dataSource.paginator = this.paginator
      }
        console.log("this.lablist",this.lablist);
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


getAppointmentlist(labPatientId: string): string {

  // lab.patientName === patientlist.id
  const patientObj = this.patientlist.find(
    (patient: any) => patient.id === labPatientId
  );

  if (!patientObj) {
    return '';
  }

  // patientlist.patientName === appointmentslist.id
  const appointmentObj = this.appointmentslist.find(
    (appointment: any) => appointment.id === patientObj.patientName
  );

  if (!appointmentObj) {
    return '';
  }

  return `${appointmentObj.firstName} ${appointmentObj.lastName}`;
}

  getlaboratorylist(laboratoryId: string): string {  
    return this.laboratorylist.find((laboratoryObj:any) => laboratoryObj.id === laboratoryId)?.laboratoryName ;
  }

  openReport(obj:any){
      const dialogRef = this.dialog.open(ReportViewComponent, {
        data: obj,
       
      })
    }
  
}
