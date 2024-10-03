import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-medicine-dialog',
  templateUrl: './medicine-dialog.component.html',
  styleUrls: ['./medicine-dialog.component.scss']
})
export class MedicineDialogComponent implements OnInit {
  addmedicineForm: FormGroup;
  action: string;
  local_data: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MedicineDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.addmedicallist()
    if (this.action === 'Update') {
      this.addmedicineForm.controls['medicineName'].setValue(this.local_data.medicineName)
      this.addmedicineForm.controls['companyName'].setValue(this.local_data.companyName)
      this.addmedicineForm.controls['dosage'].setValue(this.local_data.dosage)
      this.addmedicineForm.controls['price'].setValue(this.local_data.price)

    }
  }

  addmedicallist() {
    this.addmedicineForm = this.fb.group({
      medicineName: ['', Validators.required],
      companyName: ['', Validators.required],
      dosage: ['', Validators.required],
      price: ['', Validators.required],

    })
  }

  doAction(): void {
    const payload = {
      id: this.local_data.id ? this.local_data.id : '',
      medicineName: this.addmedicineForm.value.medicineName,
      companyName: this.addmedicineForm.value.companyName,
      dosage: this.addmedicineForm.value.dosage,
      price: this.addmedicineForm.value.price,

    }
    console.log('Addmedicinedialog=====>>>>>', payload);
    this.dialogRef.close({ event: this.action, data: payload });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
