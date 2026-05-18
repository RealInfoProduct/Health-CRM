import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-addlaboratorydialog',
  templateUrl: './addlaboratorydialog.component.html',
  styleUrls: ['./addlaboratorydialog.component.scss']
})
export class AddlaboratorydialogComponent implements OnInit {
  addlaboratoryForm: FormGroup;
  action: string;
  local_data: any;
 hidePassword: boolean = true;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddlaboratorydialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any

  ) {

    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.laboratorylist()
    if (this.action === 'Update') {
      this.addlaboratoryForm.controls['firstName'].setValue(this.local_data.firstName)
      this.addlaboratoryForm.controls['middleName'].setValue(this.local_data.middleName)
      this.addlaboratoryForm.controls['lastName'].setValue(this.local_data.lastName)
      this.addlaboratoryForm.controls['laboratoryName'].setValue(this.local_data.laboratoryName)
      this.addlaboratoryForm.controls['mobileNumber'].setValue(this.local_data.mobileNumber)
      this.addlaboratoryForm.controls['laboratoryEmail'].setValue(this.local_data.laboratoryEmail)
      this.addlaboratoryForm.controls['address'].setValue(this.local_data.address)
       this.addlaboratoryForm.controls['userName'].setValue(this.local_data.userName)
      this.addlaboratoryForm.controls['password'].setValue(this.local_data.password)
    }
  }

  laboratorylist() {
    this.addlaboratoryForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
      laboratoryName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      laboratoryEmail: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      address: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  doAction(): void {
    const payload = {
        id: this.local_data.id ? this.local_data.id : '',
      firstName: this.addlaboratoryForm.value.firstName,
      middleName: this.addlaboratoryForm.value.middleName,
      lastName: this.addlaboratoryForm.value.lastName,
      laboratoryName: this.addlaboratoryForm.value.laboratoryName,
      mobileNumber: this.addlaboratoryForm.value.mobileNumber,
      laboratoryEmail: this.addlaboratoryForm.value.laboratoryEmail,
      address: this.addlaboratoryForm.value.address,
      userName: this.addlaboratoryForm.value.userName,
      password: this.addlaboratoryForm.value.password,
      userId: localStorage.getItem("userId"),
      clinicId: localStorage.getItem("clinicId"),
      userType:"Laboratory",
    }
    this.dialogRef.close({ event: this.action, data: payload });
  }

}
