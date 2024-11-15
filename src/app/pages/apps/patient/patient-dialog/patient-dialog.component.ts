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

  laboratorylist: any = []

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
    this.PatientFormlist()
    if (this.action === 'Update') {
      this.PatientForm.controls['firstName'].setValue(this.local_data.firstName)
      this.PatientForm.controls['lastName'].setValue(this.local_data.lastName)
      this.PatientForm.controls['mobileNumber'].setValue(this.local_data.mobileNumber)
      this.PatientForm.controls['address'].setValue(this.local_data.address)
      this.PatientForm.controls['bloodGroup'].setValue(this.local_data.bloodGroup)
      this.PatientForm.controls['date'].setValue(this.convertTimestamp(this.local_data.date))
      this.PatientForm.controls['age'].setValue(this.local_data.age)
      this.PatientForm.controls['gender'].setValue(this.local_data.gender)
      this.PatientForm.controls['laboratoryName'].setValue(this.local_data.laboratoryName)
    }
    this.getlaboratoryData()
  }

  getlaboratoryData() {
    this.firebaseCollectionService.getDocuments('ClinicList', 'laboratorylist').then((laboratory) => {
      if (laboratory && laboratory.length > 0) {
        this.laboratorylist = laboratory
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
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      address: ['', Validators.required],
      bloodGroup: [''],
      date: [new Date(), Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      laboratoryName: ['', Validators.required],
    })
  }

  Adddata() {
    const payload = {
      firstName: this.PatientForm.value.firstName,
      lastName: this.PatientForm.value.lastName,
      mobileNumber: this.PatientForm.value.mobileNumber,
      address: this.PatientForm.value.address,
      bloodGroup: this.PatientForm.value.bloodGroup,
      date: this.PatientForm.value.date,
      age: this.PatientForm.value.age,
      gender: this.PatientForm.value.gender,
      laboratoryName: this.PatientForm.value.laboratoryName
    }
    this.dialogRef.close({ event: this.action, data: payload });

  }

}
