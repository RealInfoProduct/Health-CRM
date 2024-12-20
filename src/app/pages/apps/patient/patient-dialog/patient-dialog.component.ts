import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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

  laboratorylist: any = []
  doctorslist: any = []
  appointmentslist: any = []


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
        doctorName: this.local_data.doctorName,
        appointmentStatus: this.local_data.appointmentStatus,
        visitType: this.local_data.visitType,
        paymentMethod: this.local_data.paymentMethod
      });
    }
  
    this.getlaboratoryData();
    this.getdoctorsdata();
    this.getappointmentdata();
  
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
        console.log('this.doctorslist-----',this.doctorslist);
      } 
    }).catch((error) =>{
      console.error('Error fetching doctors:', error);
    })
    
  }

  getappointmentdata() {
    this.firebaseCollectionService.getDocuments('Doctor', 'appointmentslist').then((appointment) => {
      if (appointment && appointment.length > 0) {
        this.appointmentslist = appointment
        console.log('this.appointmentslist====>>>',this.appointmentslist);
      }
    }).catch((error) =>{
      console.error('Error fetching doctors:', error);
    })
  }

  getlaboratoryData() {
    this.firebaseCollectionService.getDocuments('Doctor', 'laboratorylist').then((laboratory) => {
      if (laboratory && laboratory.length > 0) {
        this.laboratorylist = laboratory
        console.log('Laboratory List:', this.laboratorylist);
      } 
    }).catch((error) => {
      console.error('Error fetching laboratory:', error);
    });
  }

  convertTimestamp(element : any): Date | null {
    if(element instanceof Timestamp){
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
      doctorName: ['', Validators.required],
      appointmentStatus: ['', Validators.required],
      visitType: ['', Validators.required],
      paymentMethod: ['', Validators.required]
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
      doctorName: this.PatientForm.value.doctorName,
      appointmentStatus: this.PatientForm.value.appointmentStatus,
      visitType: this.PatientForm.value.visitType,
      paymentMethod: this.PatientForm.value.paymentMethod
    }
    console.log(payload);
    this.dialogRef.close({ event: this.action, data: payload });

  }

}
