import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-addlabdialog',
  templateUrl: './addlabdialog.component.html',
  styleUrls: ['./addlabdialog.component.scss']
})
export class AddlabdialogComponent implements OnInit {
  addlabForm: FormGroup;
  action: string;
  local_data: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddlabdialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.addmedicallist()
    if (this.action === 'Update') {
      this.addlabForm.controls['patientName'].setValue(this.local_data.patientName)
      this.addlabForm.controls['mobileNumber'].setValue(this.local_data.mobileNumber)
      this.addlabForm.controls['age'].setValue(this.local_data.age)
      this.addlabForm.controls['gender'].setValue(this.local_data.gender)
      this.addlabForm.controls['reportType'].setValue(this.local_data.reportType)
      this.addlabForm.controls['reportName'].setValue(this.local_data.reportName)
      this.addlabForm.controls['reportFee'].setValue(this.local_data.reportFee)
      this.addlabForm.controls['disease'].setValue(this.local_data.disease)
    }
  }

  addmedicallist() {
    this.addlabForm = this.fb.group({
      patientName:['',Validators.required],
      mobileNumber:['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      age:['',Validators.required],
      gender:['',Validators.required],
      reportType: ['', Validators.required],
      reportName: ['', Validators.required],
      reportFee: ['', Validators.required],
      disease: ['', Validators.required],
    })
  }

  doAction(): void {
    const payload = {
      patientName:this.addlabForm.value.patientName,
      mobileNumber:this.addlabForm.value.mobileNumber,
      age:this.addlabForm.value.age,
      gender:this.addlabForm.value.gender,
      reportType: this.addlabForm.value.reportType,
      reportName: this.addlabForm.value.reportName,
      reportFee: this.addlabForm.value.reportFee,
      disease: this.addlabForm.value.disease
    }
    console.log('Addlabdialog=====>>>>>', payload);
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}


