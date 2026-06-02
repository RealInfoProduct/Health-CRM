import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-addlabdialog',
  templateUrl: './addlabdialog.component.html',
  styleUrls: ['./addlabdialog.component.scss']
})
export class AddlabdialogComponent implements OnInit {
  addlabForm: FormGroup;
  action: string;
  local_data: any;

  appointmentslist: any =[]
  laboratorylist: any =[]
  patientlist: any =[]
   filteredPatients: any[] = [];

     paymentMethodList = [
    { id: 1, name: 'Cash' },
    { id: 2, name: 'Net Banking' }
  ]


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddlabdialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private firebaseCollectionService: FirebaseCollectionService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.addmedicallist()
    this.createReport()
    if (this.action === 'Update') {
      this.addlabForm.controls['patientName'].setValue(this.local_data.patientName)
      this.addlabForm.controls['date'].setValue(this.local_data.date)
      this.addlabForm.controls['mobileNumber'].setValue(this.local_data.mobileNumber)
      this.addlabForm.controls['age'].setValue(this.local_data.age)
      this.addlabForm.controls['gender'].setValue(this.local_data.gender)
      this.addlabForm.controls['amount'].setValue(this.local_data.amount)
      this.addlabForm.controls['discount'].setValue(this.local_data.discount || 0)
      this.addlabForm.controls['paymentMethod'].setValue(this.local_data.paymentMethod)
      this.addlabForm.controls['gst'].setValue(this.local_data.gst || 0)
      this.addlabForm.controls['netamount'].setValue(this.local_data.netamount)
    }
    if (this.local_data.reports && this.local_data.reports.length > 0) {
      this.local_data.reports.forEach((report: any) => {
          const reportDate = report.date
      ? new Date(report.date.seconds * 1000 + report.date.nanoseconds / 1000000)
      : '';
        this.reports.push(this.fb.group({
          date: reportDate,
          reportType: report.reportType,
          reportName: report.reportName,
          reportFee: report.reportFee || 0,
          disease: report.disease,
        }));
      });
    }
    this.getlaboratoryData();
    this.getappointmentdata();
    this.getPatientData();

    this.addlabForm.get('patientName')?.valueChanges.subscribe((selectedId) => {

      const selectedPatient = this.patientlist.find((item: any) => item.id === selectedId);
      if (selectedPatient) {
        this.addlabForm.patchValue({
          mobileNumber: selectedPatient.mobileNumber,
          age: selectedPatient.age,
          gender: selectedPatient.gender,
          laboratoryName: "",
        });
          this.reports.clear();
  if (selectedPatient.reports && selectedPatient.reports.length > 0) {
      selectedPatient.reports.forEach((report: any) => {

          const reportDate = report.date
      ? new Date(report.date.seconds * 1000 + report.date.nanoseconds / 1000000)
      : '';

        this.reports.push(this.fb.group({
          date: reportDate,
          reportType: report.reportType || '',
          reportName: report.reportName || '',
          reportFee: report.reportFee || 0,
          disease: report.disease || '',
        }));
      });
    }
      }
    });

 

this.addlabForm.get('discount')?.valueChanges.subscribe(() => {
  this.calculateAmounts();
});

this.addlabForm.get('gst')?.valueChanges.subscribe(() => {
  this.calculateAmounts();
});
  }

   getPatientData() {
    this.firebaseCollectionService.getDocuments('Doctor', 'patientlist').then((patient) => {
      if (patient && patient.length > 0) {
      this.patientlist = patient.filter((item: any) =>
          item.reports && item.reports.length > 0
        );
         this.filteredPatients = [...this.patientlist];
      }
    })
  }

  getappointmentdata() {
    this.firebaseCollectionService.getDocuments('Doctor', 'appointmentslist').then((appointment) => {
      if (appointment && appointment.length > 0) {
        this.appointmentslist = appointment
      }
    })
  }

  getlaboratoryData() {
    this.firebaseCollectionService.getDocuments('Doctor', 'laboratorylist').then((laboratory) => {
      if (laboratory && laboratory.length > 0) {
        this.laboratorylist = laboratory
      } 
    }).catch((error) => {
      console.error('Error fetching laboratory:', error);
    });
  }

  addmedicallist() {
    this.addlabForm = this.fb.group({
      date:[new Date()],
      patientName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      reports: this.fb.array([]),
      paymentMethod: ['', Validators.required],
      amount: ['', Validators.required],
      discount: [0, Validators.required],
      gst: [5, Validators.required],
      netamount: ['', Validators.required],
    })
  }

  doAction(): void {
    const payload = {
      date: this.addlabForm.value.date,
      patientName: this.addlabForm.value.patientName,
      mobileNumber: this.addlabForm.value.mobileNumber,
      age: this.addlabForm.value.age,
      gender: this.addlabForm.value.gender,
       reports: this.addlabForm.value.reports,
       paymentMethod: this.addlabForm.value.paymentMethod,
      amount: this.addlabForm.value.amount,
      discount: this.addlabForm.value.discount,
      gst: this.addlabForm.value.gst,
      netamount: this.addlabForm.value.netamount,
    }
    
    this.dialogRef.close({ event: this.action, data: payload });
  }


  get reports(): FormArray {
    return this.addlabForm.get('reports') as FormArray;
  }
  
  createReport(): FormGroup {
    const reportGroup = this.fb.group({
       date: [new Date()],
      reportType: ['', Validators.required],
      reportName: ['', Validators.required],
      reportFee: ['', Validators.required],
      disease: ['', Validators.required],
    });
       this.addlabForm.get('reports')?.valueChanges.subscribe(() => {
  this.calculateAmounts();
});
  return reportGroup;
  }
  
  removeReport(index: number) {
    this.reports.removeAt(index);
     this.calculateAmounts();
  }
  
  addReportDetail(){
     this.reports.push(this.createReport());
      this.calculateAmounts();
  }

  getpatientName(patientid:any){
     return this.appointmentslist.find((id: any) => id.id === patientid)?.firstName
  }
  getpatientNamelast(patientid:any){
     return this.appointmentslist.find((id: any) => id.id === patientid)?.lastName
  }


filterPatients(event: any) {

  const value = event.target.value
    .toLowerCase()
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  this.filteredPatients = this.patientlist.filter((item: any) => {

    const firstName =
      this.getpatientName(item.patientName) || '';

    const lastName =
      this.getpatientNamelast(item.patientName) || '';

    // Display format
    const fullName = `${firstName} ${lastName}`
      .toLowerCase()
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return fullName.includes(value);
  });
}

  onSelectOpen(isOpen: boolean, searchInput: HTMLInputElement) {
    if (isOpen) {
      searchInput.value = '';
      this.filteredPatients = [...this.patientlist];
    }
  }

 calculateAmounts() {

  let amount = 0;

  this.reports.controls.forEach((control: any) => {
    amount += Number(control.get('reportFee')?.value || 0);
  });

  const discount = Number(this.addlabForm.get('discount')?.value || 0);

  const gst = Number(this.addlabForm.get('gst')?.value || 0);

  // discount remove
  const subtotal = amount - discount;

  // gst add
  const gstAmount = (subtotal * gst) / 100;

  // final amount
  const netamount = subtotal + gstAmount;

  this.addlabForm.patchValue({
    amount: amount,
    netamount: netamount.toFixed(2)
  }, { emitEvent: false });

}
  
}


