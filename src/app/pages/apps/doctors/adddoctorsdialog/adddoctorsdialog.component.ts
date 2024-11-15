import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-adddoctorsdialog',
  templateUrl: './adddoctorsdialog.component.html',
  styleUrls: ['./adddoctorsdialog.component.scss']
})
export class AdddoctorsdialogComponent implements OnInit {
  doctorsForm: FormGroup;
  action: string;
  local_data: any;

  DepartmentList = [
    { id: 1, name: 'Urology' },
    { id: 2, name: 'Dentist' },
    { id: 3, name: 'General' },
    { id: 4, name: 'Cardiology' },
    { id: 5, name: 'Neurology' },
    { id: 6, name: 'Pediatrics' },
    { id: 7, name: 'Orthopedics' },
    { id: 8, name: 'Dermatology' },
    { id: 9, name: 'Psychiatry' },
    { id: 10, name: 'Ophthalmology' },
    { id: 11, name: 'ENT' },
    { id: 12, name: 'Gastroenterology' },
    { id: 13, name: 'Pulmonology' },
    { id: 14, name: 'Nephrology' },
    { id: 15, name: 'Gynecology' }
  ]


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AdddoctorsdialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.adddoctorslist()
    if (this.action === 'Update') {
      this.doctorsForm.controls['doctorsName'].setValue(this.local_data.doctorsName)
      this.doctorsForm.controls['department'].setValue(this.local_data.department)
      this.doctorsForm.controls['degree'].setValue(this.local_data.degree)
      this.doctorsForm.controls['mobileNumber'].setValue(this.local_data.mobileNumber)
      this.doctorsForm.controls['email'].setValue(this.local_data.email)
      this.doctorsForm.controls['joiningDate'].setValue(this.convertTimestamp(this.local_data.joiningDate))
      this.doctorsForm.controls['experience'].setValue(this.local_data.experience)
      this.doctorsForm.controls['consultationFee'].setValue(this.local_data.consultationFee)
      this.doctorsForm.controls['availability'].setValue(this.local_data.availability)
      this.doctorsForm.controls['rating'].setValue(this.local_data.rating)
      this.doctorsForm.controls['clinicLocation'].setValue(this.local_data.clinicLocation)
    }
  }
  
  convertTimestamp(element : any): Date | null {
    if(element instanceof Timestamp){
      return element.toDate();
    }
    return null;
      }

  adddoctorslist() {
    this.doctorsForm = this.fb.group({
      doctorsName: ['', Validators.required],
      department: ['', Validators.required],
      degree: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      email: ['', [Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      joiningDate: [new Date(), Validators.required],
      experience: ['', Validators.required],
      consultationFee: ['', Validators.required],
      availability: ['', Validators.required],
      rating: ['', Validators.required],
      clinicLocation: ['', Validators.required]
    })
  }

  doAction(){ 
    const payload = {
    doctorsName:this.doctorsForm.value.doctorsName,
    department:this.doctorsForm.value.department,
    degree:this.doctorsForm.value.degree,
    mobileNumber:this.doctorsForm.value.mobileNumber,
    email:this.doctorsForm.value.email,
    joiningDate: this.doctorsForm.value.joiningDate,
    experience: this.doctorsForm.value.experience,
    consultationFee: this.doctorsForm.value.consultationFee,
    availability: this.doctorsForm.value.availability,
    rating: this.doctorsForm.value.rating,
    clinicLocation: this.doctorsForm.value.clinicLocation
  }
  this.dialogRef.close({ event: this.action, data: payload });
}

}
