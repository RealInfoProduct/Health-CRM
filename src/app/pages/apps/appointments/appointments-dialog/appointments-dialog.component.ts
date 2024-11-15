import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-appointments-dialog',
  templateUrl: './appointments-dialog.component.html',
  styleUrls: ['./appointments-dialog.component.scss']
})
export class AppointmentsDialogComponent implements OnInit {
  appointmentsForm: FormGroup
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

  doctorslist: any = []

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AppointmentsDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private firebaseCollectionService: FirebaseCollectionService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.addAppointmentsList()
    if (this.action === 'Update') {
      this.appointmentsForm.controls['firstName'].setValue(this.local_data.firstName)
      this.appointmentsForm.controls['lastName'].setValue(this.local_data.lastName)
      this.appointmentsForm.controls['doctorName'].setValue(this.local_data.doctorName)
      this.appointmentsForm.controls['gender'].setValue(this.local_data.gender)
      this.appointmentsForm.controls['date'].setValue(this.convertTimestamp(this.local_data.date))
      this.appointmentsForm.controls['time'].setValue(this.local_data.time)
      this.appointmentsForm.controls['address'].setValue(this.local_data.address)
      this.appointmentsForm.controls['mobileNumber'].setValue(this.local_data.mobileNumber)
      this.appointmentsForm.controls['email'].setValue(this.local_data.email)
      this.appointmentsForm.controls['bloodGroup'].setValue(this.local_data.bloodGroup)
      this.appointmentsForm.controls['age'].setValue(this.local_data.age)
      this.appointmentsForm.controls['appointmentStatus'].setValue(this.local_data.appointmentStatus)
      this.appointmentsForm.controls['visitType'].setValue(this.local_data.visitType)
      this.appointmentsForm.controls['paymentMethod'].setValue(this.local_data.paymentMethod)
    }
    this.getdoctorsdata()
  }

  
  getdoctorsdata() {
    this.firebaseCollectionService.getDocuments('ClinicList', 'doctorslist').then((doctors) => {
      if (doctors && doctors.length > 0) {
        this.doctorslist = doctors
        console.log('this.doctorslist-----',this.doctorslist);
      } 
    }).catch((error) =>{
      console.error('Error fetching doctors:', error);
    })
    
  }

  convertTimestamp(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  addAppointmentsList() {
    this.appointmentsForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      doctorName: ['', Validators.required],
      gender: ['', Validators.required],
      date: [new Date(), Validators.required],
      time: ['', Validators.required],
      address: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      email: [''],
      bloodGroup: [''],
      age: ['', Validators.required],
      appointmentStatus: ['', Validators.required],
      visitType: ['', Validators.required],
      paymentMethod: ['', Validators.required]
    })
  }

  doAction() {
    const payload = {
      firstName: this.appointmentsForm.value.firstName,
      lastName: this.appointmentsForm.value.lastName,
      doctorName: this.appointmentsForm.value.doctorName,
      gender: this.appointmentsForm.value.gender,
      date: this.appointmentsForm.value.date,
      time: this.appointmentsForm.value.time,
      address: this.appointmentsForm.value.address,
      mobileNumber: this.appointmentsForm.value.mobileNumber,
      email: this.appointmentsForm.value.email,
      bloodGroup: this.appointmentsForm.value.bloodGroup,
      age: this.appointmentsForm.value.age,
      appointmentStatus: this.appointmentsForm.value.appointmentStatus,
      visitType: this.appointmentsForm.value.visitType,
      paymentMethod: this.appointmentsForm.value.paymentMethod
    }
    this.dialogRef.close({ event: this.action, data: payload });
  }
}
