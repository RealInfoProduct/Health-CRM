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
    'tokenNumber',
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
  medicallist: any = []
  medicinelist: any = []
  userType:any =''

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
    this.getMedicalData()
     this.userType = localStorage.getItem('usertype');
  }


  getappointmentdata() {
    const userId = localStorage.getItem('userId')
        const clinicId = localStorage.getItem('clinicId')
        const ReceptionistId = localStorage.getItem('ReceptionistId')
    this.firebaseCollectionService.getAppointmentsList(userId, clinicId, ReceptionistId,'appointmentslist').then((appointment) => {
      if (appointment && appointment.length > 0) {
         this.appointmentslist = appointment
          console.log("this.appointmentslist", this.appointmentslist);
          
       }
    }).catch((error) => {
      console.error('Error fetching doctors:', error);
    })
  }

  getdoctorsdata() {
      const userId = localStorage.getItem('userId')
     const clinicId = localStorage.getItem('clinicId')
    this.firebaseCollectionService.getDoctors(userId,clinicId, 'doctorsList').then((doctors) => {
      if (doctors && doctors.length > 0) {
          this.doctorslist = doctors

        }
    }).catch((error) => {
      console.error('Error fetching doctors:', error);
    })
  }

  async getMedicalData() {

    const userId = localStorage.getItem('userId')
    const clinicId = localStorage.getItem('clinicId')

    this.medicinelist = []
    debugger
    const medical = await this.firebaseCollectionService
      .getMedical(userId, clinicId, 'medicallist')

    this.medicallist = medical
    if (medical && medical.length > 0) {

      for (const item of medical) {

        const medicalId = item.id
        const medicine = await this.firebaseCollectionService
          .getMedicine(userId, clinicId, medicalId, 'medicinelist')

        this.medicinelist = [...this.medicinelist, ...medicine]
      }
    }

    console.log('FINAL medicinelist =>', this.medicinelist)
  }


async getlaboratoryData() {

  const userId = localStorage.getItem('userId')
  const clinicId = localStorage.getItem('clinicId')

  this.lablist = []

  const laboratory = await this.firebaseCollectionService
    .getlaboratory(userId, clinicId, 'laboratorylist')

  this.laboratorylist = laboratory

  if (laboratory && laboratory.length > 0) {

    for (const item of laboratory) {

      const laboratoryId = item.id

      const lab = await this.firebaseCollectionService
        .getlab(userId, clinicId, laboratoryId, 'lablist')

      this.lablist = [...this.lablist, ...lab]
    }
  }

  console.log('FINAL LABLIST =>', this.lablist)
}

  getPatientData() {
       const userId = localStorage.getItem('userId')
     const clinicId = localStorage.getItem('clinicId')
     const doctorId = localStorage.getItem('doctorId')

    this.firebaseCollectionService.getpatient( userId, clinicId, doctorId, 'patientlist').then((patient) => {
      this.patientlist = patient
      if (patient && patient.length > 0) {
        this.dataSource = new MatTableDataSource(this.patientlist);
        this.dataSource.paginator = this.paginator
        console.log("this.patientlist",this.patientlist);
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
      width: action === 'Delete' ? '25%' : '55%'
    })
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === 'Add') {
         const userId = localStorage.getItem('userId')
     const clinicId = localStorage.getItem('clinicId')
     const doctorId = localStorage.getItem('doctorId')
        this.firebaseCollectionService.addpatient(userId, clinicId, doctorId, result.data)
        this.getPatientData()
      }
    //   if (result?.event === 'Update') {
    //     this.patientlist.forEach((element: any) => {
    //       if (obj.id === element.id) {
    //          const userId = localStorage.getItem('userId')
    //  const clinicId = localStorage.getItem('clinicId')
    //  const doctorId = localStorage.getItem('doctorId')
    //         const laboratoryId = result.data.laboratoryName
    //         this.firebaseCollectionService.updatepatient(userId, clinicId, doctorId, obj.id, result.data);
    //         this.firebaseCollectionService.addlab(userId, clinicId, laboratoryId, result.data)
    //         this.getPatientData()
    //       }
    //     })
    //     const lab = this.lablist?.find((l: any) => l.patientName === obj.patientName && l.mobileNumber === obj.mobileNumber);
    //     if (lab) {

    //       const oldReports = lab.reports ? [...lab.reports] : [];

    //       let newReportsData = result.data?.reports || result.data;

    //       const incoming = Array.isArray(newReportsData)
    //         ? newReportsData
    //         : newReportsData
    //           ? [newReportsData]
    //           : [];

    //       incoming.forEach((newReport: any) => {

    //         // 👉 MATCH condition (important)
    //         const index = oldReports.findIndex((old: any) =>
    //           old.reportName === newReport.reportName &&
    //           old.reportType === newReport.reportType
    //         );

    //         if (index !== -1) {
    //           // 🔄 UPDATE existing object
    //           oldReports[index] = {
    //             ...oldReports[index],
    //             ...newReport,
    //             updatedAt: new Date().toISOString()
    //           };
    //         } else {
    //           // ➕ ADD new object
    //           oldReports.push({
    //             ...newReport,
    //             createdAt: new Date().toISOString()
    //           });
    //         }
    //       });

    //       const updatedLab = {
    //         ...lab,
    //         reports: oldReports
    //       };
    //       const userId = localStorage.getItem('userId')
    //       const clinicId = localStorage.getItem('clinicId')
    //       const laboratoryId = lab.laboratoryId
    //       this.firebaseCollectionService.updatelab(userId,clinicId,laboratoryId,lab.id,updatedLab).then(() => {
    //       });
    //     }

    //   //   const medi = this.medicinelist?.find((m: any)=> m.patientName === obj.patientName)
    //   //  if (medi) {

    //   //     const oldReports = medi.medicine ? [...medi.medicine] : [];

    //   //     let newReportsData = result.data?.medicine || result.data;

    //   //     const incoming = Array.isArray(newReportsData)
    //   //       ? newReportsData
    //   //       : newReportsData
    //   //         ? [newReportsData]
    //   //         : [];

    //   //     incoming.forEach((newReport: any) => {

    //   //       // 👉 MATCH condition (important)
    //   //       const index = oldReports.findIndex((old: any) =>
    //   //         old.reportName === newReport.reportName &&
    //   //         old.reportType === newReport.reportType
    //   //       );

    //   //       if (index !== -1) {
    //   //         // 🔄 UPDATE existing object
    //   //         oldReports[index] = {
    //   //           ...oldReports[index],
    //   //           ...newReport,
    //   //           updatedAt: new Date().toISOString()
    //   //         };
    //   //       } else {
    //   //         // ➕ ADD new object
    //   //         oldReports.push({
    //   //           ...newReport,
    //   //           createdAt: new Date().toISOString()
    //   //         });
    //   //       }
    //   //     });

    //   //     const updatedLab = {
    //   //       ...medi,
    //   //       medicine: oldReports
    //   //     };

    //   //     this.firebaseCollectionService.updateDocument(
    //   //       'Medical',
    //   //       medi.id,
    //   //       updatedLab,
    //   //       'medicinelist'
    //   //     ).then(() => {
    //   //       this.getmedicineData();
    //   //     });
    //   //   }
    //   }
    if (result?.event === 'Update') {

  // =========================
  // UPDATE PATIENT
  // =========================
  this.patientlist.forEach((element: any) => {

    if (obj.id === element.id) {

      const userId = localStorage.getItem('userId');
      const clinicId = localStorage.getItem('clinicId');
      const doctorId = localStorage.getItem('doctorId');

      const laboratoryId = result.data.laboratoryName;
      // update patient
      this.firebaseCollectionService.updatepatient(
        userId,
        clinicId,
        doctorId,
        obj.id,
        result.data
      );

      // =========================
      // LABORATORY SECTION
      // =========================

      // check existing lab record
      const existingLab = this.lablist?.find(
        (l: any) =>
          l.patientName === obj.patientName &&
          l.mobileNumber === obj.mobileNumber
      );

      if (existingLab) {

        // old reports
        const oldReports = existingLab.reports
          ? [...existingLab.reports]
          : [];

        // incoming reports
        let newReportsData = result.data?.reports || result.data;

        const incoming = Array.isArray(newReportsData)
          ? newReportsData
          : newReportsData
            ? [newReportsData]
            : [];

        incoming.forEach((newReport: any) => {

          // match existing report
          const index = oldReports.findIndex((old: any) =>
            old.reportName === newReport.reportName &&
            old.reportType === newReport.reportType
          );

          if (index !== -1) {

            // update existing report
            oldReports[index] = {
              ...oldReports[index],
              ...newReport,
              updatedAt: new Date().toISOString()
            };

          } else {

            // add new report
            oldReports.push({
              ...newReport,
              createdAt: new Date().toISOString()
            });
          }
        });

        // updated lab object
        const updatedLab = {
          ...existingLab,
          ...result.data,
          reports: oldReports,
          updatedAt: new Date().toISOString()
        };

        // update existing lab document
        this.firebaseCollectionService.updatelab(
          userId,
          clinicId,
          laboratoryId,
          existingLab.id,
          updatedLab
        ).then(() => {
          console.log('Lab updated successfully');
        });

      } else {

        // =========================
        // FIRST TIME ADD LAB
        // =========================

        const addLabData = {
          ...result.data,
          createdAt: new Date().toISOString()
        };

        this.firebaseCollectionService.addlab(
          userId,
          clinicId,
          laboratoryId,
          addLabData
        ).then(() => {
          console.log('Lab added successfully');
        });
      }

      // refresh patient data
      this.getPatientData();
    }
  });




  // =========================
  // MEDICINE SECTION
  // =========================

//   const medi = this.medicinelist?.find(
//     (m: any) => m.patientName === obj.patientName
//   );

//   if (medi) {

//     const oldMedicine = medi.medicine
//       ? [...medi.medicine]
//       : [];

//     let newMedicineData = result.data?.medicine || result.data;

//     const incomingMedicine = Array.isArray(newMedicineData)
//       ? newMedicineData
//       : newMedicineData
//         ? [newMedicineData]
//         : [];

//     incomingMedicine.forEach((newMedicine: any) => {

//       const index = oldMedicine.findIndex((old: any) =>
//         old.medicineName === newMedicine.medicineName
//       );

//       if (index !== -1) {

//         oldMedicine[index] = {
//           ...oldMedicine[index],
//           ...newMedicine,
//           updatedAt: new Date().toISOString()
//         };

//       } else {

//         oldMedicine.push({
//           ...newMedicine,
//           createdAt: new Date().toISOString()
//         });
//       }
//     });

//     const updatedMedicine = {
//       ...medi,
//       medicine: oldMedicine
//     };

//     this.firebaseCollectionService.updateDocument(
//       'Medical',
//       medi.id,
//       updatedMedicine,
//       'medicinelist'
//     ).then(() => {
// console.log('Medicine added successfully');
      
//     });
//   }
}

if (result?.event === 'Update') {

  const userId = localStorage.getItem('userId');
  const clinicId = localStorage.getItem('clinicId');
  const doctorId = localStorage.getItem('doctorId');

  // =========================
  // UPDATE PATIENT
  // =========================

  this.firebaseCollectionService.updatepatient(
    userId,
    clinicId,
    doctorId,
    obj.id,
    result.data
  );

  // =====================================================
  // REPORTS / LAB SECTION
  // =====================================================

  if (result.data?.reports) {

    const laboratoryId = result.data.laboratoryName;

    const existingLab = this.lablist?.find(
      (l: any) =>
        l.patientName === obj.patientName &&
        l.mobileNumber === obj.mobileNumber
    );

    if (existingLab) {

      const oldReports = existingLab.reports
        ? [...existingLab.reports]
        : [];

      const incomingReports = Array.isArray(result.data.reports)
        ? result.data.reports
        : [result.data.reports];

      incomingReports.forEach((newReport: any) => {

        const index = oldReports.findIndex((old: any) =>
          old.reportName === newReport.reportName &&
          old.reportType === newReport.reportType
        );

        if (index !== -1) {

          // UPDATE REPORT
          oldReports[index] = {
            ...oldReports[index],
            ...newReport,
            updatedAt: new Date().toISOString()
          };

        } else {

          // ADD REPORT
          oldReports.push({
            ...newReport,
            createdAt: new Date().toISOString()
          });
        }
      });

      const updatedLab = {
        ...existingLab,
        reports: oldReports,
        updatedAt: new Date().toISOString()
      };

      // UPDATE LAB
      this.firebaseCollectionService.updatelab(
        userId,
        clinicId,
        laboratoryId,
        existingLab.id,
        updatedLab
      ).then(() => {
        console.log('Lab updated successfully');
          this.getlaboratoryData()
      });

    } else {

      // ADD LAB FIRST TIME
      const addLabData = {
        ...result.data,
        createdAt: new Date().toISOString()
      };

      this.firebaseCollectionService.addlab(
        userId,
        clinicId,
        laboratoryId,
        addLabData
      ).then(() => {
        console.log('Lab added successfully');
          this.getlaboratoryData()
      });
    }
  }
// =====================================================
// MEDICINE SECTION
// =====================================================

if (result.data?.medical) {

  const medicalId = result.data.medicalName;

  const medi = this.medicinelist?.find(
    (m: any) => m.patientName === obj.patientName
  );

  if (medi) {

    const oldMedicine = Array.isArray(medi.medicine)
      ? medi.medicine.filter((x: any) => x)
      : [];

    // FIXED HERE
    const incomingMedicine = Array.isArray(result.data.medical)
      ? result.data.medical.filter((x: any) => x)
      : [result.data.medical];

    incomingMedicine.forEach((newMedicine: any) => {

      if (!newMedicine?.medicineName) return;

      const index = oldMedicine.findIndex((old: any) =>
        old?.medicineName === newMedicine.medicineName
      );

      if (index !== -1) {

        // UPDATE MEDICINE
        oldMedicine[index] = {
          ...oldMedicine[index],
          ...newMedicine,
          updatedAt: new Date().toISOString()
        };

      } else {

        // ADD MEDICINE
        oldMedicine.push({
          ...newMedicine,
          createdAt: new Date().toISOString()
        });
      }
    });

    const updatedMedicine = {
      ...medi,
      medicine: oldMedicine,
      updatedAt: new Date().toISOString()
    };

    this.firebaseCollectionService.updateMedicine(
      userId,
      clinicId,
      medicalId,
      medi.id,
      updatedMedicine
    ).then(() => {
      console.log('Medicine updated successfully');
      this.getMedicalData()
    });

  } else {

    // ADD MEDICINE FIRST TIME

    const addMedicineData = {
      patientName: obj.patientName,
      mobileNumber: obj.mobileNumber,
      userId: localStorage.getItem("userId"),
      clinicId: localStorage.getItem("clinicId"),

      // FIXED HERE
      medicine: Array.isArray(result.data.medical)
        ? result.data.medical.filter((x: any) => x)
        : [result.data.medical],

      createdAt: new Date().toISOString()
    };

    this.firebaseCollectionService.addMedicine(
      userId,
      clinicId,
      medicalId,
      addMedicineData
    ).then(() => {
      console.log('Medicine added successfully');
       this.getMedicalData()
    });
  }
}
}
      if (result?.event === 'Delete') {
         const userId = localStorage.getItem('userId')
     const clinicId = localStorage.getItem('clinicId')
     const doctorId = localStorage.getItem('doctorId')
        this.firebaseCollectionService.deletepatient(userId, clinicId, doctorId, obj.id);
        this.getPatientData()
      }
    });
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
