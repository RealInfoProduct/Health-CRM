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

  paymentMethodList = [
    { id: 1, name: 'Cash' },
    { id: 2, name: 'Net Banking' }
  ]

  appointmentslist:any = []
  patientlist:any = []

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
    console.log("this.patientlist",this.patientlist);
    this.addmedicallist()
    this.getPatientData()
    this.getappointmentdata()
    if (this.action === 'Update') {
      this.addmedicineForm.controls['patientName'].setValue(this.local_data.patientName)
      this.addmedicineForm.controls['mobileNumber'].setValue(this.local_data.mobileNumber)
      this.addmedicineForm.controls['amount'].setValue(this.local_data.amount)
      this.addmedicineForm.controls['discount'].setValue(this.local_data.discount || 0)
      this.addmedicineForm.controls['paymentMethod'].setValue(this.local_data.paymentMethod)
      this.addmedicineForm.controls['gst'].setValue(this.local_data.gst || 0)
      this.addmedicineForm.controls['netamount'].setValue(this.local_data.netamount)
      this.local_data.medicine.forEach((element:any) => {
        this.addMedicine(element)
      });
    }else{
      this.addMedicine()
    }

  this.addmedicineForm.get('patientName')?.valueChanges.subscribe((patientId) => {
const selectedPatient = this.patientlist.find(
  (patient) => patient.patientName === patientId
);
  if (selectedPatient) {
    const medicineArray = this.getMedicineFormArry();
    medicineArray.clear();
    selectedPatient.medical?.forEach((med: any) => {

      medicineArray.push(
        this.fb.group({
          date: med.date
            ? new Date(med.date.seconds * 1000)
            : '',
          medicineName: med.medicineName || '',
          companyName: med.CompanyName || '',
          category: med.category || '',
          qty: med.qty || '',
          rate: med.rate || '',
          time: med.time || ''
        })
      );

    });
  }
});
  }

   getPatientData() {
    this.firebaseCollectionService.getDocuments('Doctor', 'patientlist').then((patient) => {
      if (patient && patient.length > 0) {
        this.patientlist = patient 
      }
    })
  }
 

  getappointmentdata() {
    // Check if appointmentslist is already stored in localStorage
    const storedAppointments = localStorage.getItem('appointmentsData');
    
    if (storedAppointments) {
      // Parse the JSON string and assign it to appointmentslist
      this.appointmentslist = JSON.parse(storedAppointments);
      console.log('Loaded appointments from localStorage:', this.appointmentslist);
    } else {
      // Fetch from Firebase if not found in localStorage
      this.firebaseCollectionService.getDocuments('Doctor', 'appointmentslist').then((appointment) => {
        if (appointment && appointment.length > 0) {
          this.appointmentslist = appointment;
  
          // Store the fetched data in localStorage
          localStorage.setItem('appointmentslist', JSON.stringify(this.appointmentslist));
          console.log('Fetched appointments from Firebase and stored in localStorage:', this.appointmentslist);
        }
      }).catch((error) => {
        console.error('Error fetching appointments:', error);
      });
    }
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
      mobileNumber: ['', Validators.required],
      medicine :this.fb.array([]),
      paymentMethod: ['', Validators.required],
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

//   addMedicine(medicine?:any){
// this.getMedicineFormArry().push(
//   this.fb.group({
//       date: [medicine?.date || '', Validators.required],
//       medicineName: [medicine?.medicineName || '', Validators.required],
//       companyName: [medicine?.companyName || '', Validators.required],
//       category: [medicine?.category || '', Validators.required],
//       qty: [medicine?.qty || '', Validators.required],
//       rate: [medicine?.rate || '', Validators.required],
//   })
// )
//   }

addMedicine(medicine?: any) {

  let medicineDate: Date | string = '';

  if (medicine?.date) {

    if (medicine.date.seconds) {
      medicineDate = new Date(medicine.date.seconds * 1000);
    } else {
      medicineDate = medicine.date;
    }
  }

  this.getMedicineFormArry().push(
    this.fb.group({
      date: [medicineDate, Validators.required],
      medicineName: [medicine?.medicineName || '', Validators.required],
      companyName: [medicine?.companyName || medicine?.CompanyName || '', Validators.required],
      category: [medicine?.category || '', Validators.required],
      qty: [medicine?.qty || '', Validators.required],
      rate: [medicine?.rate || '', Validators.required],
      time: [medicine?.time || '', Validators.required],
    })
  );
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
      mobileNumber: this.addmedicineForm.value.mobileNumber,
      paymentMethod: this.addmedicineForm.value.paymentMethod,
      amount: this.addmedicineForm.value.amount,
      discount: this.addmedicineForm.value.discount,
      gst: this.addmedicineForm.value.gst,
      netamount: this.addmedicineForm.value.netamount,
    }
    this.dialogRef.close({ event: this.action, data: payload });
    console.log('payload',payload);
  }
}