import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-patient-dialog',
  templateUrl: './patient-dialog.component.html',
  styleUrls: ['./patient-dialog.component.scss']
})
export class PatientDialogComponent implements OnInit {
  PatientForm: FormGroup
  action: string;
  local_data: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PatientDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.PatientFormlist()
    if (this.action === 'Update') {
      this.PatientForm.controls['firstName'].setValue(this.local_data.firstName)
      this.PatientForm.controls['lastName'].setValue(this.local_data.lastName)
      this.PatientForm.controls['mobileNumber'].setValue(this.local_data.mobileNumber)
      this.PatientForm.controls['address'].setValue(this.local_data.address)
      this.PatientForm.controls['bloodGroup'].setValue(this.local_data.bloodGroup)
      this.PatientForm.controls['dob'].setValue(this.convertTimestamp(this.local_data.dob))
      this.PatientForm.controls['age'].setValue(this.local_data.age)
      this.PatientForm.controls['gender'].setValue(this.local_data.gender)
    }
  }

  convertTimestamp(element : any): Date | null {
    if(element instanceof Timestamp){
      return element.toDate();
    }
    return null;
      }

  PatientFormlist() {
    this.PatientForm = this.fb.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      address: ['', Validators.required],
      bloodGroup: [''],
      dob: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
    })
  }

  Adddata() {
    const payload = {
      firstName: this.PatientForm.value.firstName,
      lastName: this.PatientForm.value.lastName,
      mobileNumber: this.PatientForm.value.mobileNumber,
      address: this.PatientForm.value.address,
      bloodGroup: this.PatientForm.value.bloodGroup,
      dob: this.PatientForm.value.dob,
      age: this.PatientForm.value.age,
      gender: this.PatientForm.value.gender
    }
    console.log('PatientDialog======>>>>>>', payload);
    this.dialogRef.close({ event: this.action, data: payload });

  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
