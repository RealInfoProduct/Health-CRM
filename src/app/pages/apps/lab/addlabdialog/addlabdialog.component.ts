import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppEmployeeDialogContentComponent, Employee } from '../../employee/employee.component';
import { findIndex } from 'rxjs';

@Component({
  selector: 'app-addlabdialog',
  templateUrl: './addlabdialog.component.html',
  styleUrls: ['./addlabdialog.component.scss']
})
export class AddlabdialogComponent implements OnInit {
  addlabForm: FormGroup;
  action: string;
  local_data: any;
  joiningDate: any = '';

  constructor(
    private fb: FormBuilder,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppEmployeeDialogContentComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: Employee,
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    if (this.local_data.DateOfJoining !== undefined) {
      this.joiningDate = this.datePipe.transform(
        new Date(this.local_data.DateOfJoining),
        'yyyy-MM-dd',
      );
    }
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

  selectFile(event: any): void {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      return;
    }
    const mimeType = event.target.files[0].type;
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
    };
  }
}


