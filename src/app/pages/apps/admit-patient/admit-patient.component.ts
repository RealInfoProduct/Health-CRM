import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdmitPatientDialogComponent } from './admit-patient-dialog/admit-patient-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-admit-patient',
  templateUrl: './admit-patient.component.html',
  styleUrls: ['./admit-patient.component.scss']
})
export class AdmitPatientComponent implements OnInit {

  appointmentsColumns: string[] = [
    'id',
    'patientName',
    'mobileNumber',
    'department',
    'ward',
    'roomNumber',
    'bedNumber',
    'action'
  ]

  admitlist: any[] = []

  dataSource = new MatTableDataSource(this.admitlist)
   @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    public dialog: MatDialog,
    private firebaseCollectionService: FirebaseCollectionService
  ) { }

  ngOnInit(): void {
    this.getadmitdata();
  }

  getadmitdata() {
    const userId = localStorage.getItem('userId')
    const clinicId = localStorage.getItem('clinicId')
    const ReceptionistId = localStorage.getItem('ReceptionistId')
    this.firebaseCollectionService.getadmitList(userId, clinicId, ReceptionistId, 'admitlist').then((admit) => {
        this.admitlist = admit
       if (admit && admit.length > 0) {
        this.dataSource = new MatTableDataSource(this.admitlist)
        
        this.dataSource.paginator = this.paginator
      } else {
        this.admitlist = []
        this.dataSource = new MatTableDataSource(this.admitlist)
        this.dataSource.paginator = this.paginator
      }
    })
  }


   applyFilter(event: Event)  {
      const filterValue = (event.target as HTMLInputElement)
    .value
    .toLowerCase()
    .trim();
      this.dataSource.data = this.admitlist.filter((item: any) => {

    const fullName =
      `${item.patientName || ''} `
        .toLowerCase()
        .trim();

    const mobile =
      `${item.mobileNumber || ''}`;

    return (
      fullName.includes(filterValue) ||
      mobile.includes(filterValue)
    );
  });
   }

  openadminDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AdmitPatientDialogComponent, {
      data: obj,
      width: action === 'Delete' ? '25%' : '50%'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        const userId = localStorage.getItem('userId')
        const clinicId = localStorage.getItem('clinicId')
        const ReceptionistId = localStorage.getItem('ReceptionistId')
        this.firebaseCollectionService.addadmitlist(userId, clinicId, ReceptionistId, result.data);
        this.getadmitdata()

      } else if (result.event === 'Update') {
        this.admitlist.forEach((element: any) => {
          if (obj.id === element.id) {
            const userId = localStorage.getItem('userId')
            const clinicId = localStorage.getItem('clinicId')
            const ReceptionistId = localStorage.getItem('ReceptionistId')
            this.firebaseCollectionService.updateadmitList(userId, clinicId, ReceptionistId, obj.id, result.data);
            this.getadmitdata()
          }
        });
      } else if (result.event === 'Delete') {
        const userId = localStorage.getItem('userId')
        const clinicId = localStorage.getItem('clinicId')
        const ReceptionistId = localStorage.getItem('ReceptionistId')
        this.firebaseCollectionService.deleteadmitList(userId, clinicId, ReceptionistId, obj.id);
        this.getadmitdata()
      }

    })
  }


}
