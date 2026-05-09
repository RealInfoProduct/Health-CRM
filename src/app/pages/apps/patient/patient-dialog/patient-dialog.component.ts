import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-patient-dialog',
  templateUrl: './patient-dialog.component.html',
  styleUrls: ['./patient-dialog.component.scss']
})
export class PatientDialogComponent implements OnInit {
  PatientForm: FormGroup
  action: string;
  local_data: any;

  appointmentStatusList: any = [
    { id: 1, name: 'Scheduled' },
    { id: 2, name: 'Completed' },
    { id: 3, name: 'Canceled' }
  ]

  visitTypeList: any = [
    { id: 1, name: 'New Patient' },
    { id: 2, name: 'Follow-Up' }
  ]

  paymentMethodList = [
    { id: 1, name: 'Cash' },
    { id: 2, name: 'Credit Card' },
    { id: 3, name: 'Debit Card' },
    { id: 4, name: 'Net Banking' }
  ]

  CategoryList = [
    { id: 1, name: 'Tablet' },
    { id: 2, name: 'Syrup' },
    { id: 3, name: 'Injectable' }
  ]


  laboratorylist: any = []
  doctorslist: any = []
  medicallist: any = []
  appointmentslist: any = []
  filteredPatients: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PatientDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private firebaseCollectionService: FirebaseCollectionService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.PatientFormlist();

    if (this.action === 'Update') {
      this.PatientForm.patchValue({
        patientName: this.local_data.patientName,
        mobileNumber: this.local_data.mobileNumber,
        address: this.local_data.address,
        bloodGroup: this.local_data.bloodGroup,
        date: this.convertTimestamp(this.local_data.date),
        time: this.local_data.time,
        age: this.local_data.age,
        gender: this.local_data.gender,
        laboratoryName: this.local_data.laboratoryName,
        medicalName: this.local_data.medicalName,
        doctorName: this.local_data.doctorName,
        appointmentStatus: this.local_data.appointmentStatus,
        visitType: this.local_data.visitType,
        paymentMethod: this.local_data.paymentMethod
      });
      if (this.local_data.reports && this.local_data.reports.length > 0) {
        this.local_data.reports.forEach((report: any) => {
          this.reports.push(this.fb.group({
            date: report.date ? this.convertTimestamp(report.date) || report.date : '',
            reportType: report.reportType,
            reportName: report.reportName,
            disease: report.disease,
          }));
        });
      }
      if (this.local_data.medical && this.local_data.medical.length > 0) {
        this.local_data.medical.forEach((medicals: any) => {
          this.medical.push(this.fb.group({
            date: medicals.date ? this.convertTimestamp(medicals.date) || medicals.date : '',
            medicineName: medicals.medicineName,
            CompanyName: medicals.CompanyName,
            category: medicals.category,
            qty: medicals.qty,
            time: medicals.time,
          }));
        });
      }
    }

    this.getlaboratoryData();
    this.getdoctorsdata();
    this.getappointmentdata();
    this.getmedicineData();

    this.PatientForm.get('patientName')?.valueChanges.subscribe((patientId) => {
      const selectedPatient = this.appointmentslist.find(
        (appointment) => appointment.id === patientId
      );

      if (selectedPatient) {
        this.PatientForm.patchValue({
          mobileNumber: selectedPatient.mobileNumber,
          address: selectedPatient.address,
          bloodGroup: selectedPatient.bloodGroup,
          date: this.convertTimestamp(selectedPatient.date),
          time: selectedPatient.time,
          age: selectedPatient.age,
          gender: selectedPatient.gender,
          doctorName: selectedPatient.doctorName,
          appointmentStatus: selectedPatient.appointmentStatus,
          visitType: selectedPatient.visitType,
          paymentMethod: selectedPatient.paymentMethod
        });
      }
    });
  }


  getdoctorsdata() {
    this.firebaseCollectionService.getDocuments('Doctor', 'doctorslist').then((doctors) => {
      if (doctors && doctors.length > 0) {
        this.doctorslist = doctors
      }
    }).catch((error) => {
      console.error('Error fetching doctors:', error);
    })

  }

  getmedicineData() {
    this.firebaseCollectionService.getDocuments('Doctor', 'medicallist').then((medical) => {
      if (medical && medical.length > 0) {
        this.medicallist = medical
        console.log(this.medicallist);

      }
    }).catch((error) => {
      console.error('Error fetching medical:', error);
    })
  }

  getappointmentdata() {
    this.firebaseCollectionService.getDocuments('Doctor', 'appointmentslist').then((appointment) => {
      if (appointment && appointment.length > 0) {
        this.appointmentslist = appointment
      }
      this.filteredPatients = [...this.appointmentslist];
    }).catch((error) => {
      console.error('Error fetching doctors:', error);
    })
  }

  getlaboratoryData() {
    this.firebaseCollectionService.getDocuments('Doctor', 'laboratorylist').then((laboratory) => {
      if (laboratory && laboratory.length > 0) {
        this.laboratorylist = laboratory
      }
    }).catch((error) => {
      console.error('Error fetching laboratory:', error);
    });
  }

  convertTimestamp(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  PatientFormlist() {
    this.PatientForm = this.fb.group({
      patientName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      address: ['', Validators.required],
      bloodGroup: [''],
      date: ['', Validators.required],
      time: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      laboratoryName: [''],
      medicalName: [''],
      doctorName: ['', Validators.required],
      appointmentStatus: ['', Validators.required],
      visitType: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      reports: this.fb.array([]),
      medical: this.fb.array([]),
    })
  }

  Adddata() {
    const payload = {
      patientName: this.PatientForm.value.patientName,
      mobileNumber: this.PatientForm.value.mobileNumber,
      address: this.PatientForm.value.address,
      bloodGroup: this.PatientForm.value.bloodGroup,
      date: this.PatientForm.value.date,
      time: this.PatientForm.value.time,
      age: this.PatientForm.value.age,
      gender: this.PatientForm.value.gender,
      laboratoryName: this.PatientForm.value.laboratoryName,
      medicalName: this.PatientForm.value.medicalName,
      doctorName: this.PatientForm.value.doctorName,
      appointmentStatus: this.PatientForm.value.appointmentStatus,
      visitType: this.PatientForm.value.visitType,
      paymentMethod: this.PatientForm.value.paymentMethod,
      reports: this.PatientForm.value.reports,
      medical: this.PatientForm.value.medical,
    }
    console.log(payload);
    this.dialogRef.close({ event: this.action, data: payload });

  }

  get reports(): FormArray {
    return this.PatientForm.get('reports') as FormArray;
  }

  createReport(): FormGroup {
    return this.fb.group({
      date: [new Date()],
      reportType: ['', Validators.required],
      reportName: ['', Validators.required],
      disease: ['', Validators.required],
    });
  }

  removeReport(index: number) {
    this.reports.removeAt(index);
  }

  addReportDetail() {
    this.reports.push(this.createReport());
  }

  onLabChange(event: any) {
    if (event.value) {
      if (this.reports.length === 0) {
        this.addReportDetail()
      }
    } else {
      this.reports.clear();
    }
  }

  get medical(): FormArray {
    return this.PatientForm.get('medical') as FormArray;
  }

  createMedical(): FormGroup {
    return this.fb.group({
      date: [new Date()],
      medicineName: ['', Validators.required],
      CompanyName: ['', Validators.required],
      category: ['', Validators.required],
      qty: ['', Validators.required],
      time: ['', Validators.required],
    });
  }

  removeMedical(index: number) {
    this.medical.removeAt(index);
  }

  addMedicalDetail() {
    this.medical.push(this.createMedical());
  }

  onMedicalChange(event: any) {
    if (event.value) {
      if (this.medical.length === 0) {
        this.addMedicalDetail()
      }
    } else {
      this.medical.clear();
    }
  }

  filterPatients(event: any) {
    const value = event.target.value
      .toLowerCase()
      .trim();

    this.filteredPatients = this.appointmentslist.filter((item: any) => {
      const fullName =
        `${item.firstName || ''} ${item.lastName || ''}`
          .toLowerCase()
          .trim();

      return fullName.includes(value);
    });
  }

  onSelectOpen(isOpen: boolean, searchInput: HTMLInputElement) {
    if (isOpen) {
      searchInput.value = '';
      this.filteredPatients = [...this.appointmentslist];
    }
  }
}
