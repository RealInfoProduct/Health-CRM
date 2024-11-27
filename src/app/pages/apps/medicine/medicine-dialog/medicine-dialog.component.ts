import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  appointmentslist = []

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
      this.addmedicineForm.controls['amount'].setValue(this.local_data.amount)
      this.addmedicineForm.controls['discount'].setValue(this.local_data.discount)
      this.addmedicineForm.controls['gst'].setValue(this.local_data.gst)
      this.addmedicineForm.controls['netamount'].setValue(this.local_data.netamount)
      this.local_data.medicine.forEach((element:any) => {
        this.addMedicine(element)
      });
    }else{
      this.addMedicine()
    }
    this.getappointmentdata()
  }

  getappointmentdata() {
    this.firebaseCollectionService.getDocuments('ClinicList', 'appointmentslist').then((appointment) => {
      if (appointment && appointment.length > 0) {
        this.appointmentslist = appointment
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
      medicine :this.fb.array([]),
      amount: ['', Validators.required],
      discount: [0, Validators.required],
      gst: [5, Validators.required],
      netamount: ['', Validators.required],
    })
    this.getMedicineFormArry().valueChanges.subscribe(() => this.updateAmount());
    this.addmedicineForm.get('discount')?.valueChanges.subscribe(() => this.updateAmount());
    this.addmedicineForm.get('gst')?.valueChanges.subscribe(() => this.updateAmount());
  }

getMedicineFormArry(){
  return this.addmedicineForm.get('medicine') as FormArray
}

  addMedicine(medicine?:any){
this.getMedicineFormArry().push(
  this.fb.group({
      medicineName: [medicine?.medicineName || '', Validators.required],
      companyName: [medicine?.companyName || '', Validators.required],
      category: [medicine?.category || '', Validators.required],
      // pack: [medicine?.pack || '', Validators.required],
      qty: [medicine?.qty || '', Validators.required],
      rate: [medicine?.rate || '', Validators.required],
  })
)
  }

  removemedicine(index:any){
    this.getMedicineFormArry().removeAt(index)
  }

  updateAmount(): void {
    let totalAmount = 0;
  
    this.getMedicineFormArry().controls.forEach((group: FormGroup) => {
      const qty = group.get('qty')?.value || 0;
      const rate = group.get('rate')?.value || 0;
  
      if (qty > 0 && rate > 0) {
        const amount = qty * rate;
        group.get('amount')?.setValue(parseFloat(amount.toFixed(2)), { emitEvent: false });
        totalAmount += amount;
      }
    });
  
    // Apply discount and GST on the total amount
    const discount = this.addmedicineForm.get('discount')?.value || 0;
    const gst = this.addmedicineForm.get('gst')?.value || 0;
  
    const discountedAmount = totalAmount - (totalAmount * discount / 100);
    const netAmount = discountedAmount + (discountedAmount * gst / 100);
  
    this.addmedicineForm.get('amount')?.setValue(parseFloat(totalAmount.toFixed(2)), { emitEvent: false });
    this.addmedicineForm.get('netamount')?.setValue(parseFloat(netAmount.toFixed(2)), { emitEvent: false });
  }
  

  doAction(): void {
    const payload = {
      patientName: this.addmedicineForm.value.patientName,
      medicine: this.addmedicineForm.value.medicine,
      amount: this.addmedicineForm.value.amount,
      discount: this.addmedicineForm.value.discount,
      gst: this.addmedicineForm.value.gst,
      netamount: this.addmedicineForm.value.netamount,
    }
    this.dialogRef.close({ event: this.action, data: payload });
    console.log('payload',payload);
  }

}