import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-admit-patient-dialog',
  templateUrl: './admit-patient-dialog.component.html',
  styleUrls: ['./admit-patient-dialog.component.scss']
})
export class AdmitPatientDialogComponent implements OnInit{
  admitPatientForm: FormGroup;
   action: string;
  local_data: any;
  doctorslist:any []=[];
  appointmentslist:any []=[];
  admitlist:any []=[];

filteredAppointmentsList: any[] = [];

departments: string[] = [];
wards: string[] = [];

filteredDepartments: string[] = [];
filteredWards: string[] = [];

  constructor(
    private fb: FormBuilder,
        public dialogRef: MatDialogRef<AdmitPatientDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
         private firebaseCollectionService: FirebaseCollectionService
  ){
      this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.getadmitdata();
    this.addmedicallist();
    
    this.filteredDepartments = [...this.departments];
    this.filteredWards = [...this.wards];
    
    this.admitPatientForm.get('department')?.valueChanges.subscribe(value => {
      this.filteredDepartments = this._filterDepartment(value || '');
    });
    
    this.admitPatientForm.get('ward')?.valueChanges.subscribe(value => {
      this.filteredWards = this._filterWard(value || '');
    });
    this.getdoctorsdata();
    this.getappointmentdata();
    this.setCurrentTime();
    this.setvalue()


  }

  private _filterDepartment(value: string): string[] {
  const filterValue = value.toLowerCase();

  return this.departments.filter(dept =>
    dept.toLowerCase().includes(filterValue)
  );
}

private _filterWard(value: string): string[] {
  const filterValue = value.toLowerCase();

  return this.wards.filter(ward =>
    ward.toLowerCase().includes(filterValue)
  );
}
  

  setvalue(){
    if (this.action === 'Update') {
      this.admitPatientForm.controls['admitDate'].setValue(this.convertTimestamp(this.local_data.admitDate))
      this.admitPatientForm.controls['time'].setValue(this.local_data.time)
      this.admitPatientForm.controls['patientName'].setValue(this.local_data.patientName)
      this.admitPatientForm.controls['mobileNumber'].setValue(this.local_data.mobileNumber)
      this.admitPatientForm.controls['gender'].setValue(this.local_data.gender)
      this.admitPatientForm.controls['age'].setValue(this.local_data.age)
      this.admitPatientForm.controls['address'].setValue(this.local_data.address)
      this.admitPatientForm.controls['email'].setValue(this.local_data.email)
      this.admitPatientForm.controls['department'].setValue(this.local_data.department)
      this.admitPatientForm.controls['bloodGroup'].setValue(this.local_data.bloodGroup)
      this.admitPatientForm.controls['ward'].setValue(this.local_data.ward)
      this.admitPatientForm.controls['doctorName'].setValue(this.local_data.doctorName)
      this.admitPatientForm.controls['reasonforAdmit'].setValue(this.local_data.reasonforAdmit)
      this.admitPatientForm.controls['bedNumber'].setValue(this.local_data.bedNumber)
      this.admitPatientForm.controls['roomNumber'].setValue(this.local_data.roomNumber)
      this.admitPatientForm.controls['insuranceProviderName'].setValue(this.local_data.insuranceProviderName)
      this.admitPatientForm.controls['policyNumber'].setValue(this.local_data.policyNumber)
      this.admitPatientForm.controls['policyHolderName'].setValue(this.local_data.policyHolderName)
      this.admitPatientForm.controls['coverageAmount'].setValue(this.local_data.coverageAmount)
      this.admitPatientForm.controls['policyExpiryDate'].setValue(this.convertTimestamp(this.local_data.policyExpiryDate))
    }
  }


   convertTimestamp(element: any): Date | null {
      if (element instanceof Timestamp) {
        return element.toDate();
      }
      return null;
    }

  getadmitdata() {
  const userId = localStorage.getItem('userId');
  const clinicId = localStorage.getItem('clinicId');
  const ReceptionistId = localStorage.getItem('ReceptionistId');

  this.firebaseCollectionService
    .getadmitList(userId, clinicId, ReceptionistId, 'admitlist')
    .then((admit) => {
      if (admit && admit.length > 0) {
        this.admitlist = admit;

        this.departments = [
          ...new Set(
            admit
              .map((item: any) => item.department)
              .filter((dept: string) => dept)
          )
        ];

        this.wards = [
          ...new Set(
            admit
              .map((item: any) => item.ward)
              .filter((ward: string) => ward)
          )
        ];

        this.filteredDepartments = [...this.departments];
        this.filteredWards = [...this.wards];

      }
    });
}

    getdoctorsdata() {
      const userId = localStorage.getItem('userId')
     const clinicId = localStorage.getItem('clinicId')
    this.firebaseCollectionService.getDoctors(userId, clinicId,'doctorsList').then((doctors) => { 
      if (doctors && doctors.length > 0) {
        this.doctorslist = doctors
      }
    }).catch((error) => {
      console.error('Error fetching doctors:', error);
    })

  }

  getappointmentdata() {
    const userId = localStorage.getItem('userId')
        const clinicId = localStorage.getItem('clinicId')
        const ReceptionistId = localStorage.getItem('ReceptionistId')
    this.firebaseCollectionService.getAppointmentsList(userId, clinicId, ReceptionistId,'appointmentslist').then((appointment) => {
      if (appointment && appointment.length > 0) {
        this.appointmentslist = appointment

         this.filteredAppointmentsList = [...this.appointmentslist];
        console.log("this.appointmentslist",this.appointmentslist);
      }
    })
  }

filterPatients(event: Event) {
  const input = event.target as HTMLInputElement;
  const searchText = input.value?.trim().toLowerCase() || '';

  if (!searchText) {
    this.filteredAppointmentsList = [...this.appointmentslist];
    return;
  }

  this.filteredAppointmentsList = this.appointmentslist.filter(patient => {
    const fullName = ((patient.firstName || '') + ' ' + (patient.lastName || '')).toLowerCase();
    return fullName.includes(searchText);
  });
}

   addmedicallist() {
      this.admitPatientForm = this.fb.group({
        admitDate: [new Date()],
        time: ['', Validators.required],
        patientName: ['',Validators.required],
        mobileNumber: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
        age: ['', Validators.required],
        gender: ['', Validators.required],
        email: [''],
        address: ['', Validators.required],
        bloodGroup: [''],
        department: [''],
        doctorName: ['', Validators.required],
        ward: ['', Validators.required],
        roomNumber: ['', Validators.required],
        bedNumber: ['', Validators.required],
        reasonforAdmit: ['', Validators.required],
        insuranceProviderName: [''],
        policyNumber: [''],
        policyHolderName: [''],
        coverageAmount: [''],
        policyExpiryDate: [''],
      })
    }
  
    doAction(){
       const payload = {
         id: this.local_data.id ? this.local_data.id : '',
         admitDate: this.admitPatientForm.value.admitDate,
         time: this.admitPatientForm.value.time,
         patientName: this.admitPatientForm.value.patientName,
         mobileNumber: this.admitPatientForm.value.mobileNumber,
         age: this.admitPatientForm.value.age,
         gender: this.admitPatientForm.value.gender,
         email: this.admitPatientForm.value.email,
         address: this.admitPatientForm.value.address,
         bloodGroup: this.admitPatientForm.value.bloodGroup,
         department: this.admitPatientForm.value.department,
         doctorName: this.admitPatientForm.value.doctorName,
         ward: this.admitPatientForm.value.ward,
         roomNumber: this.admitPatientForm.value.roomNumber,
         bedNumber: this.admitPatientForm.value.bedNumber,
         reasonforAdmit: this.admitPatientForm.value.reasonforAdmit,
         insuranceProviderName: this.admitPatientForm.value.insuranceProviderName,
         policyNumber: this.admitPatientForm.value.policyNumber,
         policyHolderName: this.admitPatientForm.value.policyHolderName,
         coverageAmount: this.admitPatientForm.value.coverageAmount,
         policyExpiryDate: this.admitPatientForm.value.policyExpiryDate,
         userId: localStorage.getItem("userId"),
         clinicId: localStorage.getItem("clinicId"),
         ReceptionistId: localStorage.getItem('ReceptionistId')
    }
    this.dialogRef.close({ event: this.action, data: payload });
    }

     setCurrentTime() {
    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes();

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 => 12

    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const timeString = `${hours}:${formattedMinutes} ${ampm}`;
    this.admitPatientForm.patchValue({
      time: timeString
    });
  }

  onPatientChange(event: any) {
  const selectedPatient = this.appointmentslist.find(
    p => (p.firstName + ' ' + p.lastName) === event.value
  );

  if (selectedPatient) {
    this.admitPatientForm.patchValue({
      mobileNumber: selectedPatient.mobileNumber || '',
      age: selectedPatient.age || '',
      gender: selectedPatient.gender || '',
      email: selectedPatient.email || '',
      address: selectedPatient.address || '',
      bloodGroup: selectedPatient.bloodGroup || '',
      doctorName: selectedPatient.doctorName || ''
    });
  }
}


}
