import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-staff-dialog',
  templateUrl: './staff-dialog.component.html',
  styleUrls: ['./staff-dialog.component.scss']
})
export class StaffDialogComponent implements OnInit {
  StaffForm: FormGroup
  action: string;
  local_data: any;

  Stafflist: any = [
    { id: 1, name: 'Compounder' },
    { id: 2, name: 'Nurse' },
    { id: 3, name: 'Receptionist' },
    { id: 4, name: 'Lab Technician' },
    { id: 5, name: 'Pharmacist' },
    { id: 6, name: 'Security Guard' },
    { id: 7, name: 'Accountant' },
    { id: 8, name: 'Ward Boy' },
    { id: 9, name: 'Radiologist' },
    { id: 10, name: 'HR Manager' }
  ]

  Statuslist: any = [
    { id: 1, name: 'Active' },
    { id: 2, name: 'InActive' }
  ]

  Shiftlist: any = [
    { id: 1, name: 'Morning' },
    { id: 2, name: 'Night' },
    { id: 3, name: 'Day' },
    { id: 4, name: 'Evening' }
  ]

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<StaffDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.StaffFormlist()

    if (this.action === 'Update') {
      this.StaffForm.patchValue({
        staffName: this.local_data.staffName,
        designation: this.local_data.designation,
        mobileNumber: this.local_data.mobileNumber,
        email: this.local_data.email,
        joiningDate: this.convertTimestamp(this.local_data.joiningDate),
        salary: this.local_data.salary,
        status: this.local_data.status,
        shift: this.local_data.shift,
        experience: this.local_data.experience,
        gender: this.local_data.gender,
        address: this.local_data.address
      });
  }
}

convertTimestamp(element : any): Date | null {
  if(element instanceof Timestamp){
    return element.toDate();
  }
  return null;
    }
  

  StaffFormlist() {
    this.StaffForm = this.fb.group({
      staffName: ['', Validators.required],
      designation: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      email: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      joiningDate: [new Date(), Validators.required],
      salary: ['', Validators.required],
      status: ['', Validators.required],
      shift: ['', Validators.required],
      experience: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required]
    })
  }

  Adddata() {
    const payload = {
      staffName: this.StaffForm.value.staffName,
      designation: this.StaffForm.value.designation,
      mobileNumber: this.StaffForm.value.mobileNumber,
      email: this.StaffForm.value.email,
      joiningDate: this.StaffForm.value.joiningDate,
      salary: this.StaffForm.value.salary,
      status: this.StaffForm.value.status,
      shift: this.StaffForm.value.shift,
      experience: this.StaffForm.value.experience,
      gender: this.StaffForm.value.gender,
      address: this.StaffForm.value.address
    }
    this.dialogRef.close({ event: this.action, data: payload });
  }
}

