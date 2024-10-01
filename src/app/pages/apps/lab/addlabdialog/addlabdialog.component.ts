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
      this.addlabForm.controls['reportType'].setValue(this.local_data.reportType)
      this.addlabForm.controls['reportName'].setValue(this.local_data.reportName)
      this.addlabForm.controls['reportFee'].setValue(this.local_data.reportFee)
      this.addlabForm.controls['disease'].setValue(this.local_data.disease)
    }
  }

  addmedicallist() {
    this.addlabForm = this.fb.group({
      id: [''],
      reportType: ['', Validators.required],
      reportName: ['', Validators.required],
      reportFee: ['', Validators.required],
      disease: ['', Validators.required],
    })
  }

  doAction(): void {
    const payload = {
      id: this.local_data.id ? this.local_data.id : '',
      reportType: this.addlabForm.value.reportType,
      reportName: this.addlabForm.value.reportName,
      reportFee: this.addlabForm.value.reportFee,
      disease: this.addlabForm.value.disease
    }
    console.log('Addlabdialog=====>>>>>',payload);
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}


