import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-medicine-dialog',
  templateUrl: './medicine-dialog.component.html',
  styleUrls: ['./medicine-dialog.component.scss']
})
export class MedicineDialogComponent implements OnInit {
  addmedicineForm: FormGroup;
  action: string;
  local_data: any;

  CategoryList = [
    { id: 1, name: 'Tablet' },
    { id: 2, name: 'Syrup' },
    { id: 3, name: 'Injectable' }
  ]

  patientlist = []

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MedicineDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private firebaseCollectionService: FirebaseCollectionService

  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.addmedicallist()
    if (this.action === 'Update') {
      this.addmedicineForm.controls['patientName'].setValue(this.local_data.patientName)
      this.addmedicineForm.controls['medicineName'].setValue(this.local_data.medicineName)
      this.addmedicineForm.controls['companyName'].setValue(this.local_data.companyName)
      this.addmedicineForm.controls['category'].setValue(this.local_data.category)
      this.addmedicineForm.controls['pack'].setValue(this.local_data.pack)
      this.addmedicineForm.controls['qty'].setValue(this.local_data.qty)
      this.addmedicineForm.controls['rate'].setValue(this.local_data.rate)
      this.addmedicineForm.controls['amount'].setValue(this.local_data.amount)
      this.addmedicineForm.controls['discount'].setValue(this.local_data.discount)
      this.addmedicineForm.controls['gst'].setValue(this.local_data.gst)
      this.addmedicineForm.controls['netamount'].setValue(this.local_data.netamount)
    }
    this. getPatientData()
  }

  getPatientData() {
    this.firebaseCollectionService.getDocuments('ClinicList', 'patientlist').then((patient) => {
      if (patient && patient.length > 0) {
        this.patientlist = patient
        console.log('this.Patientlist=====',this.patientlist);
      }
    }).catch((error) => {
      console.error('Error fetching laboratory:', error);
    });
  }

  convertTimestamp(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }
  
  addmedicallist() {
    this.addmedicineForm = this.fb.group({
      patientName: ['', Validators.required],
      medicineName: ['', Validators.required],
      companyName: ['', Validators.required],
      category: ['', Validators.required],
      pack: ['', Validators.required],
      qty: ['', Validators.required],
      rate: ['', Validators.required],
      amount: ['', Validators.required],
      discount: [0, Validators.required],
      gst: [5, Validators.required],
      netamount: ['', Validators.required],
    })
    this.addmedicineForm.get('qty')?.valueChanges.subscribe(() => this.updateAmount());
    this.addmedicineForm.get('rate')?.valueChanges.subscribe(() => this.updateAmount());
    this.addmedicineForm.get('discount')?.valueChanges.subscribe(() => this.updateAmount());
    this.addmedicineForm.get('gst')?.valueChanges.subscribe(() => this.updateAmount());
  }

  updateAmount(): void {
    const qty = this.addmedicineForm.get('qty')?.value;
    const rate = this.addmedicineForm.get('rate')?.value;
    const discount = this.addmedicineForm.get('discount')?.value;
    const gst = this.addmedicineForm.get('gst')?.value;

    if (qty != null && rate != null) {

      const amount = qty * rate;

      this.addmedicineForm.get('amount')?.setValue(parseFloat(amount.toFixed(2)), { emitEvent: false });

      const discountedAmount = amount - (amount * discount / 100);

      const netAmount = discountedAmount + (discountedAmount * gst / 100);

      this.addmedicineForm.get('netamount')?.setValue(parseFloat(netAmount.toFixed(2)), { emitEvent: false });

    }
  }

  doAction(): void {
    const payload = {
      patientName: this.addmedicineForm.value.patientName,
      medicineName: this.addmedicineForm.value.medicineName,
      companyName: this.addmedicineForm.value.companyName,
      category: this.addmedicineForm.value.category,
      pack: this.addmedicineForm.value.pack,
      qty: this.addmedicineForm.value.qty,
      rate: this.addmedicineForm.value.rate,
      amount: this.addmedicineForm.value.amount,
      discount: this.addmedicineForm.value.discount,
      gst: this.addmedicineForm.value.gst,
      netamount: this.addmedicineForm.value.netamount,
    }
    this.dialogRef.close({ event: this.action, data: payload });
  }

}
