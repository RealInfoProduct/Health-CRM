import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-addbilldialog',
  templateUrl: './addbilldialog.component.html',
  styleUrls: ['./addbilldialog.component.scss']
})
export class AddbilldialogComponent implements OnInit {
  billForm: FormGroup
  action: string;
  local_data: any;

  statusList = [
    { id: 1, name: 'Paid' },
    { id: 2, name: 'Unpaid' }
  ]

  paymentMethodList = [
    { id: 1, name: 'Cash' },
    { id: 2, name: 'Credit Card' },
    { id: 3, name: 'Debit Card' },
    { id: 4, name: 'Net Banking' }
  ]
  appointmentslist: any =[]

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddbilldialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private firebaseCollectionService: FirebaseCollectionService

  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.addbilllist()
    if (this.action === 'Update') {
      this.billForm.controls['patientName'].setValue(this.local_data.patientName)
      this.billForm.controls['status'].setValue(this.local_data.status)
      this.billForm.controls['admissionDate'].setValue(this.convertTimestamp(this.local_data.admissionDate))
      this.billForm.controls['dischargeDate'].setValue(this.convertTimestamp(this.local_data.dischargeDate))
      this.billForm.controls['paymentMethod'].setValue(this.local_data.paymentMethod)
      this.billForm.controls['total'].setValue(this.local_data.total)
      this.billForm.controls['discount'].setValue(this.local_data.discount)
      this.billForm.controls['tax'].setValue(this.local_data.tax)
      this.billForm.controls['finalTotal'].setValue(this.local_data.finalTotal)
    }
    this.getappointmentdata()
  }

  getappointmentdata() {
    this.firebaseCollectionService.getDocuments('ClinicList', 'appointmentslist').then((appointment) => {
      if (appointment && appointment.length > 0) {
        this.appointmentslist = appointment
      }
    }).catch((error) =>{
      console.error('Error fetching doctors:', error);
    })
  }

  convertTimestamp(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  addbilllist() {
    this.billForm = this.fb.group({
      patientName: ['', Validators.required],
      status: ['', Validators.required],
      admissionDate: ['', Validators.required],
      dischargeDate: [new Date(), Validators.required],
      paymentMethod: ['', Validators.required],
      total: ['', Validators.required],
      discount: [0, Validators.required],
      tax: [5, Validators.required],
      finalTotal: ['', Validators.required]
    })
    this.billForm.get('total')?.valueChanges.subscribe(() => this.calculateFinalTotal());
    this.billForm.get('tax')?.valueChanges.subscribe(() => this.calculateFinalTotal());
    this.billForm.get('discount')?.valueChanges.subscribe(() => this.calculateFinalTotal());
  }

  doAction() {
    const payload = {
      patientName: this.billForm.value.patientName,
      status: this.billForm.value.status,
      admissionDate: this.billForm.value.admissionDate,
      dischargeDate: this.billForm.value.dischargeDate,
      paymentMethod: this.billForm.value.paymentMethod,
      discount: this.billForm.value.discount,
      total: this.billForm.value.total,
      tax: this.billForm.value.tax,
      finalTotal: this.billForm.value.finalTotal
    }
    console.log(payload);
    this.dialogRef.close({ event: this.action, data: payload });
  }

  calculateFinalTotal() {
    const total = this.billForm.get('total')?.value || 0;
    const discount = this.billForm.get('discount')?.value || 0;
    const tax = this.billForm.get('tax')?.value || 0;
  
    const discountAmount = total - (total * discount / 100);
    const finalTotal = discountAmount + (discountAmount * tax / 100);
  
    const roundedFinalTotal = Math.round(finalTotal);
  
    this.billForm.get('finalTotal')?.setValue(roundedFinalTotal, { emitEvent: false });
  }
  

}
