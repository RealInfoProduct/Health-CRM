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
export class PatientComponent {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  PatientColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'mobileNumber',
    'address',
    'bloodGroup',
    'dob',
    'age',
    'gender',
    'action'
  ];

  Patientlist: any = []

  dataSource = new MatTableDataSource(this.Patientlist)
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

  ngAfterViewInit(): void {
    this.getPatientData() 
  }

  getPatientData() {
    this.firebaseCollectionService.getDocuments('ClinicList', 'Patientlist').then((Patient) => {
      this.Patientlist = Patient
      console.log('this.Patientlist=====',this.Patientlist);
      if (Patient && Patient.length > 0) {
        this.dataSource = new MatTableDataSource(this.Patientlist);
      } else {
        this.Patientlist = [];
        this.dataSource = new MatTableDataSource(this.Patientlist);
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
        this.firebaseCollectionService.addDocument('ClinicList', result.data, 'Patientlist')
        this.getPatientData()
      }
      if (result?.event === 'Update') {
        this.Patientlist.forEach((element: any) => {
          if (obj.id === element.id) {
            this.firebaseCollectionService.updateDocument('ClinicList', obj.id, result.data, 'Patientlist');
            this.getPatientData()
          }
        })
      }
      if (result?.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('ClinicList', obj.id, 'Patientlist');
        this.getPatientData()
      }
    });
  }
}
