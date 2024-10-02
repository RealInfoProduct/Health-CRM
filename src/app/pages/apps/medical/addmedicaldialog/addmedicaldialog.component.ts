import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-addmedicaldialog',
  templateUrl: './addmedicaldialog.component.html',
  styleUrls: ['./addmedicaldialog.component.scss']
})
export class AddmedicaldialogComponent implements OnInit {
  addmedicalForm: FormGroup;
  action: string;
  local_data: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddmedicaldialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }
  
  ngOnInit(): void {
    this.addmedicallist()
    if (this.action === 'Update') {
      this.addmedicalForm.controls['firstName'].setValue(this.local_data.firstName)
      this.addmedicalForm.controls['middleName'].setValue(this.local_data.middleName)
      this.addmedicalForm.controls['lastName'].setValue(this.local_data.lastName)
      this.addmedicalForm.controls['medicalName'].setValue(this.local_data.medicalName)
      this.addmedicalForm.controls['mobileNumber'].setValue(this.local_data.mobileNumber)
      this.addmedicalForm.controls['middleEmail'].setValue(this.local_data.middleEmail)
      this.addmedicalForm.controls['address'].setValue(this.local_data.address)
    }
  }

  addmedicallist() {
    this.addmedicalForm = this.fb.group({
      id: [''],
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
      medicalName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      middleEmail: ['', Validators.required],
      address: ['', Validators.required]
    })
  }

  doAction(): void {
    const payload = {
      firstName: this.addmedicalForm.value.firstName,
      middleName: this.addmedicalForm.value.middleName,
      lastName: this.addmedicalForm.value.lastName,
      medicalName: this.addmedicalForm.value.medicalName,
      mobileNumber: this.addmedicalForm.value.mobileNumber,
      middleEmail: this.addmedicalForm.value.middleEmail,
      address: this.addmedicalForm.value.address,
    }
    console.log('Addmedicaldialog=====>>>>>',payload);
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}