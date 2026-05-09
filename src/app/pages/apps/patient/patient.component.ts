import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { PatientDialogComponent } from './patient-dialog/patient-dialog.component';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';
import { MedicalViewComponent } from './medical-view/medical-view.component';
import { LaboratoryViewComponent } from './laboratory-view/laboratory-view.component';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);

  PatientColumns: string[] = [
    'id',
    'patientName',
    // 'laboratoryName',
    'doctorName',
    // 'mobileNumber',
    'address',
    'bloodGroup',
    'date',
    'time',
    'age',
    'gender',
    'appointmentStatus',
    'visitType',
    'paymentMethod',
    'action'
  ];

  patientlist: any = []
  laboratorylist: any = []
  doctorslist: any = []
  appointmentslist: any = []
  lablist: any = []
  medicinelist: any = []

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

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();

    this.dataSource.data = this.patientlist.filter((item: any) => {
      const name = this.getappointmentlist(item.patientName) || ''; // or wherever name exists
      return name.toLowerCase().includes(filterValue);
    });
  }

  ngOnInit(): void {
    this.getPatientData()
    this.getlaboratoryData()
    this.getdoctorsdata()
    this.getappointmentdata()
    this.getlabdata()
    // this.getmedicineData()
  }


  getappointmentdata() {
    this.firebaseCollectionService.getDocuments('Doctor', 'appointmentslist').then((appointment) => {
      this.appointmentslist = appointment
    }).catch((error) => {
      console.error('Error fetching doctors:', error);
    })
  }

  getdoctorsdata() {
    this.firebaseCollectionService.getDocuments('Doctor', 'doctorslist').then((doctors) => {
      this.doctorslist = doctors
    }).catch((error) => {
      console.error('Error fetching doctors:', error);
    })
  }

  getlaboratoryData() {
    this.firebaseCollectionService.getDocuments('Doctor', 'laboratorylist').then((laboratory) => {
      this.laboratorylist = laboratory
    }).catch((error) => {
      console.error('Error fetching laboratory:', error);
    });
  }

  getPatientData() {
    this.firebaseCollectionService.getDocuments('Doctor', 'patientlist').then((patient) => {
      this.patientlist = patient
      if (patient && patient.length > 0) {
        this.dataSource = new MatTableDataSource(this.patientlist);
        this.dataSource.paginator = this.paginator
        console.log(this.patientlist);
      } else {
        this.patientlist = [];
        this.dataSource = new MatTableDataSource(this.patientlist);

        this.dataSource.paginator = this.paginator
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
        this.firebaseCollectionService.addDocument('Doctor', result.data, 'patientlist')
        this.getPatientData()
      }
      if (result?.event === 'Update') {
        this.patientlist.forEach((element: any) => {
          if (obj.id === element.id) {
            this.firebaseCollectionService.updateDocument('Doctor', obj.id, result.data, 'patientlist');
            this.getPatientData()
          }
        })
        const lab = this.lablist?.find((l: any) => l.patientName === obj.id);

        if (lab) {

          const oldReports = lab.reports ? [...lab.reports] : [];

          let newReportsData = result.data?.reports || result.data;

          const incoming = Array.isArray(newReportsData)
            ? newReportsData
            : newReportsData
              ? [newReportsData]
              : [];

          incoming.forEach((newReport: any) => {

            // 👉 MATCH condition (important)
            const index = oldReports.findIndex((old: any) =>
              old.reportName === newReport.reportName &&
              old.reportType === newReport.reportType
            );

            if (index !== -1) {
              // 🔄 UPDATE existing object
              oldReports[index] = {
                ...oldReports[index],
                ...newReport,
                updatedAt: new Date().toISOString()
              };
            } else {
              // ➕ ADD new object
              oldReports.push({
                ...newReport,
                createdAt: new Date().toISOString()
              });
            }
          });

          const updatedLab = {
            ...lab,
            reports: oldReports
          };

          this.firebaseCollectionService.updateDocument(
            'Doctor',
            lab.id,
            updatedLab,
            'lablist'
          ).then(() => {
            this.getlabdata();
          });
        }

      //   const medi = this.medicinelist?.find((m: any)=> m.patientName === obj.patientName)
      //  if (medi) {

      //     const oldReports = medi.medicine ? [...medi.medicine] : [];

      //     let newReportsData = result.data?.medicine || result.data;

      //     const incoming = Array.isArray(newReportsData)
      //       ? newReportsData
      //       : newReportsData
      //         ? [newReportsData]
      //         : [];

      //     incoming.forEach((newReport: any) => {

      //       // 👉 MATCH condition (important)
      //       const index = oldReports.findIndex((old: any) =>
      //         old.reportName === newReport.reportName &&
      //         old.reportType === newReport.reportType
      //       );

      //       if (index !== -1) {
      //         // 🔄 UPDATE existing object
      //         oldReports[index] = {
      //           ...oldReports[index],
      //           ...newReport,
      //           updatedAt: new Date().toISOString()
      //         };
      //       } else {
      //         // ➕ ADD new object
      //         oldReports.push({
      //           ...newReport,
      //           createdAt: new Date().toISOString()
      //         });
      //       }
      //     });

      //     const updatedLab = {
      //       ...medi,
      //       medicine: oldReports
      //     };

      //     this.firebaseCollectionService.updateDocument(
      //       'Medical',
      //       medi.id,
      //       updatedLab,
      //       'medicinelist'
      //     ).then(() => {
      //       this.getmedicineData();
      //     });
      //   }
      }
      if (result?.event === 'Delete') {
        this.firebaseCollectionService.deleteDocument('Doctor', obj.id, 'patientlist');
        this.getPatientData()
      }
    });
  }


  //    getmedicineData(){
  //   this.firebaseCollectionService.getDocuments('Medical','medicinelist').then((medicine) =>{
  //     if(medicine && medicine.length > 0){}
  //     this.medicinelist = medicine
  //   })
  // }

  getlabdata() {
    this.firebaseCollectionService.getDocuments('Doctor', 'lablist').then((lab) => {
      if (lab && lab.length > 0) {
        this.lablist = lab

      }
      console.log("this.lablist", this.lablist);
    })
  }
  getlaboratorylist(laboratoryId: string): string {
    return this.laboratorylist.find((laboratoryObj: any) => laboratoryObj.id === laboratoryId)?.laboratoryName;
  }

  getDoctorslist(doctorId: string): string {
    return this.doctorslist.find((doctorObj: any) => doctorObj.id === doctorId)?.doctorsName;
  }

  getappointmentlist(appointmentId: string): string {
    return this.appointmentslist.find((appointmentObj: any) => appointmentObj.id === appointmentId)?.firstName;
  }


  openlaboratory(obj: any) {
    const dialogRef = this.dialog.open(LaboratoryViewComponent, {
      data: obj,
    })
  }

  openMedical(obj: any) {
    const dialogRef = this.dialog.open(MedicalViewComponent, {
      data: obj,
    })
  }
}
