import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { PatientDialogComponent } from './patient-dialog/patient-dialog.component';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  PatientColumns: string[] = [
    'id',
    'laboratoryName',
    'firstName',
    'lastName',
    'mobileNumber',
    'address',
    'bloodGroup',
    'date',
    'age',
    'gender',
    'action'
  ];

  patientlist: any = []
  laboratorylist: any = []

  dataSource = new MatTableDataSource(this.patientlist)
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.getPatientData()
    this.getlaboratoryData() 
  }

  getlaboratoryData() {
    this.firebaseCollectionService.getDocuments('ClinicList', 'laboratorylist').then((laboratory) => {
      this.laboratorylist = laboratory
    }).catch((error) => {
      console.error('Error fetching laboratory:', error);
    });
  }

  getPatientData() {
    this.firebaseCollectionService.getDocuments('ClinicList', 'patientlist').then((patient) => {
      this.patientlist = patient
      console.log('this.Patientlist=====',this.patientlist);
      if (patient && patient.length > 0) {
        this.dataSource = new MatTableDataSource(this.patientlist);
      } else {
        this.patientlist = [];
        this.dataSource = new MatTableDataSource(this.patientlist);
      }
    }).catch((error) => {
      console.error('Error fetching laboratory:', error);
    });
  }

  openPatientDialog(action: string, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(PatientDialogComponent, {
      data: obj,
      width: action === 'Delete' ? '25%' : '50%'
    })
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
        this.firebaseCollectionService.addDocument('ClinicList', result.data, 'patientlist')
        this.getPatientData()
      }
      if (result?.event === 'Update') {
        this.patientlist.forEach((element: any) => {
          if (obj.id === element.id) {
            this.firebaseCollectionService.updateDocument('ClinicList', obj.id, result.data, 'patientlist');
            this.getPatientData()
          }
        })
      }
      if (result?.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('ClinicList', obj.id, 'patientlist');
        this.getPatientData()
      }
    });
  }

  getlaboratorylist(laboratoryId: string): string {  
    return this.laboratorylist.find((laboratoryObj:any) => laboratoryObj.id === laboratoryId)?.laboratoryName ;
  }

}
