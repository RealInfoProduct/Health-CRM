import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-appointments-dialog',
  templateUrl: './appointments-dialog.component.html',
  styleUrls: ['./appointments-dialog.component.scss']
})
export class AppointmentsDialogComponent implements OnInit {
  appointmentsForm: FormGroup
  action: string;
  local_data: any;

  appointmentStatusList: any = [
    { id: 1, name: 'Scheduled' },
    { id: 2, name: 'Completed' },
    { id: 3, name: 'Canceled' }
  ]

  visitTypeList: any = [
    { id: 1, name: 'New Patient' },
    { id: 2, name: 'Follow-Up' }
  ]

  paymentMethodList = [
    { id: 1, name: 'Cash' },
    { id: 2, name: 'Credit Card' },
    { id: 3, name: 'Debit Card' },
    { id: 4, name: 'Net Banking' }
  ]

  doctorslist: any = []
appointmentslist: any[] = [];
filteredPatients: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AppointmentsDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private firebaseCollectionService: FirebaseCollectionService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.addAppointmentsList()
    if (this.action === 'Update') {
      this.appointmentsForm.controls['tokenNumber'].setValue(this.local_data.tokenNumber)
      this.appointmentsForm.controls['firstName'].setValue(this.local_data.firstName)
      this.appointmentsForm.controls['lastName'].setValue(this.local_data.lastName)
      this.appointmentsForm.controls['doctorName'].setValue(this.local_data.doctorName)
      this.appointmentsForm.controls['gender'].setValue(this.local_data.gender)
      this.appointmentsForm.controls['date'].setValue(this.convertTimestamp(this.local_data.date))
      this.appointmentsForm.controls['time'].setValue(this.local_data.time)
      this.appointmentsForm.controls['address'].setValue(this.local_data.address)
      this.appointmentsForm.controls['mobileNumber'].setValue(this.local_data.mobileNumber)
      this.appointmentsForm.controls['email'].setValue(this.local_data.email)
      this.appointmentsForm.controls['bloodGroup'].setValue(this.local_data.bloodGroup)
      this.appointmentsForm.controls['age'].setValue(this.local_data.age)
      this.appointmentsForm.controls['weight'].setValue(this.local_data.weight)
      this.appointmentsForm.controls['appointmentStatus'].setValue(this.local_data.appointmentStatus)
      this.appointmentsForm.controls['visitType'].setValue(this.local_data.visitType)
      this.appointmentsForm.controls['paymentMethod'].setValue(this.local_data.paymentMethod)
    } else {
      this.setAutoTokenNumber();
      this.setCurrentTime();
    }
    this.getdoctorsdata()
   this.getappointmentdata()
  this.appointmentsForm.get('firstName')?.valueChanges.subscribe(value => {
    this.filterPatients(value);
  });
  }

  filterPatients(value: string) {

  const filterValue = value.toLowerCase();
  this.filteredPatients = this.appointmentslist.filter(patient =>
    patient.firstName.toLowerCase().includes(filterValue)
  );
}

onPatientSelected(event: MatAutocompleteSelectedEvent) {

  const selectedFirstName = event.option.value;

  const selectedPatient = this.appointmentslist.find(
    patient => patient.firstName === selectedFirstName
  );

  if (selectedPatient) {

    this.appointmentsForm.patchValue({

      firstName: selectedPatient.firstName || '',
      lastName: selectedPatient.lastName || '',
      mobileNumber: selectedPatient.mobileNumber || '',
      doctorName: selectedPatient.doctorName || '',
      address: selectedPatient.address || '',
      age: selectedPatient.age || '',
      weight: selectedPatient.weight || '',
      gender: selectedPatient.gender || '',
      bloodGroup: selectedPatient.bloodGroup || '',
      email: selectedPatient.email || ''

    });

  }
}

getappointmentdata() {
    const userId = localStorage.getItem('userId')
        const clinicId = localStorage.getItem('clinicId')
        const ReceptionistId = localStorage.getItem('ReceptionistId')
    this.firebaseCollectionService.getAppointmentsList(userId, clinicId, ReceptionistId,'appointmentslist').then((appointment) => {
      if (appointment && appointment.length > 0) {
        this.appointmentslist = appointment

      }
    })
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



  convertTimestamp(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  addAppointmentsList() {
    this.appointmentsForm = this.fb.group({
      tokenNumber: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      doctorName: ['', Validators.required],
      gender: ['', Validators.required],
      date: [new Date()],
      time: ['', Validators.required],
      address: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      email: [''],
      bloodGroup: [''],
      age: ['', Validators.required],
      weight: [''],
      appointmentStatus: ['', Validators.required],
      visitType: ['', Validators.required],
      paymentMethod: ['', Validators.required]
    })
  }

  doAction() {
    const payload = {
         id: this.local_data.id ? this.local_data.id : '',
      tokenNumber: this.appointmentsForm.value.tokenNumber,
      firstName: this.appointmentsForm.value.firstName,
      lastName: this.appointmentsForm.value.lastName,
      doctorName: this.appointmentsForm.value.doctorName,
      gender: this.appointmentsForm.value.gender,
      date: this.appointmentsForm.value.date,
      time: this.appointmentsForm.value.time,
      address: this.appointmentsForm.value.address,
      mobileNumber: this.appointmentsForm.value.mobileNumber,
      email: this.appointmentsForm.value.email,
      bloodGroup: this.appointmentsForm.value.bloodGroup,
      age: this.appointmentsForm.value.age,
      weight: this.appointmentsForm.value.weight,
      appointmentStatus: this.appointmentsForm.value.appointmentStatus,
      visitType: this.appointmentsForm.value.visitType,
      paymentMethod: this.appointmentsForm.value.paymentMethod,
       userId:localStorage.getItem("userId"),
       clinicId:localStorage.getItem("clinicId"),
      ReceptionistId: localStorage.getItem('ReceptionistId')
    }
    this.dialogRef.close({ event: this.action, data: payload });
  }

  setAutoTokenNumber() {
      const userId = localStorage.getItem('userId')
        const clinicId = localStorage.getItem('clinicId')
        const ReceptionistId = localStorage.getItem('ReceptionistId')
    this.firebaseCollectionService.getAppointmentsList(userId, clinicId, ReceptionistId,'appointmentslist').then((appointments) => {
        const today = new Date().toDateString();
        const todayAppointments = appointments.filter(appt => {
          if (!appt.date) return false;

          const apptDate = this.convertTimestamp(appt.date);
          if (!apptDate) return false;

          return apptDate.toDateString() === today;
        });

        let nextToken = 1;

        if (todayAppointments.length > 0) {
          const tokens = todayAppointments.map(a => Number(a.tokenNumber) || 0);
          const maxToken = Math.max(...tokens);
          nextToken = maxToken + 1;
        }

        this.appointmentsForm.patchValue({
          tokenNumber: nextToken
        });

      })
      .catch(err => {
        console.error(err);
        this.appointmentsForm.patchValue({ tokenNumber: 1 });
      });
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
    this.appointmentsForm.patchValue({
      time: timeString
    });
  }
}
