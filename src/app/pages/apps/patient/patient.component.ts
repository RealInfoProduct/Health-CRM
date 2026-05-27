import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { PatientDialogComponent } from './patient-dialog/patient-dialog.component';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { Timestamp } from 'firebase/firestore';
import { MedicalViewComponent } from './medical-view/medical-view.component';
import { LaboratoryViewComponent } from './laboratory-view/laboratory-view.component';
import { FormBuilder, FormGroup } from '@angular/forms';

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
    // 'paymentMethod',
    'action'
  ];

  patientlist: any = []
  laboratorylist: any = []
  doctorslist: any = []
  appointmentslist: any = []
  lablist: any = []
  medicallist: any = []
  medicinelist: any = []
  userType: any = ''
  datePatientForm: FormGroup;
  originalPatient: any[] = [];

  dataSource = new MatTableDataSource(this.patientlist)
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(
    private fb: FormBuilder,
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

    const filterValue = (event.target as HTMLInputElement)
      .value
      .toLowerCase()
      .trim();

    // =========================
    // IF SEARCH EMPTY
    // =========================
    if (!filterValue) {

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const currentDateData = this.originalPatient.filter((item: any) => {

        let itemDate: Date;

        if (item.date?.toDate) {
          itemDate = item.date.toDate();
        } else {
          itemDate = new Date(item.date);
        }

        itemDate.setHours(0, 0, 0, 0);

        return itemDate.getTime() === today.getTime();
      });

      this.dataSource.data = currentDateData;
      return;
    }

    // =========================
    // SEARCH FILTER
    // =========================
    this.dataSource.data = this.patientlist.filter((item: any) => {

      const fullName =
        `${item.firstName || ''} ${item.lastName || ''}`
          .toLowerCase();

      const mobile =
        `${item.mobileNumber || ''}`;

      return (
        fullName.includes(filterValue) ||
        mobile.includes(filterValue)
      );
    });
  }

  ngOnInit(): void {
    this.datePatientForm = this.fb.group({
      start: [new Date()],
    });
    this.getPatientData()
    this.getlaboratoryData()
    this.getdoctorsdata()
    // this.getappointmentdata()
    this.getMedicalData()
    this.userType = localStorage.getItem('usertype');
  }

  filterDate(selectedDate: Date | null) {


    const targetDate = selectedDate ? new Date(selectedDate) : new Date();

    targetDate.setHours(0, 0, 0, 0);

    const filtered = this.originalPatient.filter((item: any) => {

      let itemDate: Date | null = null;

      if (item.date?.toDate) {
        itemDate = item.date.toDate();
      } else {
        itemDate = new Date(item.date);
      }

      if (!itemDate) return false;

      itemDate.setHours(0, 0, 0, 0);

      return itemDate.getTime() === targetDate.getTime();
    });

    this.dataSource = new MatTableDataSource(filtered);
    this.dataSource.paginator = this.paginator;
  }



  getdoctorsdata() {
    const userId = localStorage.getItem('userId')
    const clinicId = localStorage.getItem('clinicId')
    this.firebaseCollectionService.getDoctors(userId, clinicId, 'doctorsList').then((doctors) => {
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
    this.firebaseCollectionService
      .getpatient(userId, clinicId, doctorId, 'patientlist')
      .then((patient) => {

        // =========================
        // SORT BY DATE & TIME
        // =========================
        patient.sort((a: any, b: any) => {

          const getDateTime = (item: any) => {

            let dateObj: Date;

            // =========================
            // FIREBASE TIMESTAMP
            // =========================
            if (item.date?.seconds) {

              dateObj = new Date(item.date.seconds * 1000);

            }

            // =========================
            // STRING DATE (DD/MM/YYYY)
            // =========================
            else if (typeof item.date === 'string') {

              const [day, month, year] = item.date.split('/');

              dateObj = new Date(`${year}-${month}-${day}`);

            }

            // =========================
            // NORMAL DATE
            // =========================
            else {

              dateObj = new Date(item.date);

            }

            // =========================
            // ADD TIME
            // =========================
            if (item.time) {

              const time = item.time.match(/(\d+):(\d+)\s?(AM|PM)/i);

              if (time) {

                let hours = parseInt(time[1], 10);
                const minutes = parseInt(time[2], 10);
                const modifier = time[3].toUpperCase();

                if (modifier === 'PM' && hours < 12) {
                  hours += 12;
                }

                if (modifier === 'AM' && hours === 12) {
                  hours = 0;
                }

                dateObj.setHours(hours, minutes, 0, 0);
              }
            }

            return dateObj.getTime();
          };

          return getDateTime(b) - getDateTime(a);
        });

        this.patientlist = patient;
        this.originalPatient = patient;

        this.dataSource = new MatTableDataSource(this.patientlist);
        this.dataSource.paginator = this.paginator;

        this.filterDate(null);
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

        this.getPatientData();

        // =====================================================
        // CHECK CHANGES
        // =====================================================

        const hasReports =
          Array.isArray(result.data?.reports)
            ? result.data.reports.length > 0
            : !!result.data?.reports;

        const hasMedical =
          Array.isArray(result.data?.medical)
            ? result.data.medical.length > 0
            : !!result.data?.medical;


        if (hasReports) {

          const laboratoryId = result.data?.laboratoryName;
            const fullPatientName =
            `${obj.firstName || ''} ${obj.lastName || ''}`.trim();

          const existingLab = this.lablist?.find(
            (l: any) =>
              l.patientName === obj.patientName &&
              l.mobileNumber === obj.mobileNumber
          );

          // CHECK REPORT CHANGES
          const newReports = JSON.stringify(result.data?.reports || []);
          const oldReportsData = JSON.stringify(existingLab?.reports || []);

          const isReportsChanged = newReports !== oldReportsData;

          // ONLY CALL IF REPORTS CHANGED
          if (isReportsChanged) {

            if (existingLab) {

              const oldReports = Array.isArray(existingLab.reports)
                ? [...existingLab.reports]
                : [];

              const incomingReports = Array.isArray(result.data.reports)
                ? result.data.reports
                : [result.data.reports];

              incomingReports.forEach((newReport: any) => {

                if (!newReport) return;

                const index = oldReports.findIndex(
                  (old: any) =>
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

                this.getlaboratoryData();

              });

            } else {

              // ADD LAB FIRST TIME
              const addLabData = {
                  patientName: fullPatientName,
              mobileNumber: obj.mobileNumber,
              age: obj.age,
              gender: obj.gender,
              userId: userId,
              clinicId: clinicId,
              reports: Array.isArray(result.data.reports)
                ? result.data.reports
                : [result.data.reports],
              date: new Date().toISOString()

              };
              this.firebaseCollectionService.addlab(
                userId,
                clinicId,
                laboratoryId,
                addLabData
              ).then(() => {

                console.log('Lab added successfully');

                this.getlaboratoryData();

              });
            }
          }
        }


        if (hasMedical) {

          const medicalId = result.data?.medicalName;

          if (!medicalId) {
            console.error('medicalId is missing');
            return;
          }

          const fullPatientName =
            `${obj.firstName || ''} ${obj.lastName || ''}`.trim();

          const medi = this.medicinelist?.find(
            (m: any) =>
              m.patientName?.trim().toLowerCase() ===
              fullPatientName.toLowerCase()
          );

          if (medi) {

            // EXISTING OLD MEDICINE
            const oldMedicine = Array.isArray(medi.medicine)
              ? [...medi.medicine]
              : [];

            // NEW INCOMING MEDICINE
            const incomingMedicine = Array.isArray(result.data.medical)
              ? result.data.medical
              : [result.data.medical];

            incomingMedicine.forEach((newMedicine: any) => {

              if (!newMedicine?.medicineName) return;

              // FIND OLD MEDICINE
              const index = oldMedicine.findIndex(
                (old: any) =>
                  old?.medicineName?.trim().toLowerCase() ===
                  newMedicine?.medicineName?.trim().toLowerCase()
              );

              // =========================
              // UPDATE OLD MEDICINE
              // =========================

              if (index !== -1) {

                oldMedicine[index] = {
                  ...oldMedicine[index],
                  ...newMedicine,
                  updatedAt: new Date().toISOString()
                };

              }

              // =========================
              // ADD NEW MEDICINE
              // =========================

              else {

                oldMedicine.push({
                  ...newMedicine,
                  createdAt: new Date().toISOString()
                });
              }
            });

            // FINAL UPDATED DATA
            const updatedMedicine = {
              ...medi,
              medicine: oldMedicine,
              updatedAt: new Date().toISOString()
            };

            // UPDATE API
            this.firebaseCollectionService.updateMedicine(
              userId,
              clinicId,
              medicalId,
              medi.id,
              updatedMedicine
            ).then(() => {
              this.getMedicalData()
              console.log('Medicine updated successfully');

            });

          }

          // =====================================================
          // ADD FIRST TIME
          // =====================================================

          else {

            const addMedicineData = {
              patientName: fullPatientName,
              mobileNumber: obj.mobileNumber,
              userId: userId,
              clinicId: clinicId,
              medicine: Array.isArray(result.data.medical)
                ? result.data.medical
                : [result.data.medical],
              createdAt: new Date().toISOString()
            };

            this.firebaseCollectionService.addMedicine(
              userId,
              clinicId,
              medicalId,
              addMedicineData
            ).then(() => {
              this.getMedicalData()
              console.log('Medicine added successfully');

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
