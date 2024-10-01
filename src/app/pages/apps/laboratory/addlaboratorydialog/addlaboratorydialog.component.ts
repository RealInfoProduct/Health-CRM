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
      this.addlaboratoryForm.controls['laboratorylName'].setValue(this.local_data.laboratorylName)
      this.addlaboratoryForm.controls['mobileNumber'].setValue(this.local_data.mobileNumber)
      this.addlaboratoryForm.controls['laboratorylEmail'].setValue(this.local_data.laboratorylEmail)
      this.addlaboratoryForm.controls['address'].setValue(this.local_data.address)
    }
  }

  laboratorylist() {
    this.addlaboratoryForm = this.fb.group({
      id: [''],
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
      laboratorylName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      laboratorylEmail: ['', Validators.required],
      address: ['', Validators.required]
    })
  }

  doAction(): void {
    const payload = {
      id: this.local_data.id ? this.local_data.id : '',
      firstName: this.addlaboratoryForm.value.firstName,
      middleName: this.addlaboratoryForm.value.middleName,
      lastName: this.addlaboratoryForm.value.lastName,
      laboratorylName: this.addlaboratoryForm.value.laboratorylName,
      mobileNumber: this.addlaboratoryForm.value.mobileNumber,
      laboratorylEmail: this.addlaboratoryForm.value.laboratorylEmail,
      address: this.addlaboratoryForm.value.address,
    }
    console.log('Addlaboratorydialog======>>>>>',payload);
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
