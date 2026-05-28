import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-adddoctorsdialog',
  templateUrl: './adddoctorsdialog.component.html',
  styleUrls: ['./adddoctorsdialog.component.scss']
})
export class AdddoctorsdialogComponent implements OnInit {
  doctorsForm: FormGroup;
  action: string;
  local_data: any;
  hidePassword: boolean = true;
  DepartmentList = [
    { id: 1, name: 'Urology' },
    { id: 2, name: 'Dentist' },
    { id: 3, name: 'General' },
    { id: 4, name: 'Cardiology' },
    { id: 5, name: 'Neurology' },
    { id: 6, name: 'Pediatrics' },
    { id: 7, name: 'Orthopedics' },
    { id: 8, name: 'Dermatology' },
    { id: 9, name: 'Psychiatry' },
    { id: 10, name: 'Ophthalmology' },
    { id: 11, name: 'ENT' },
    { id: 12, name: 'Gastroenterology' },
    { id: 13, name: 'Pulmonology' },
    { id: 14, name: 'Nephrology' },
    { id: 15, name: 'Gynecology' }
  ]
medicallist:any =[]
userList:any =[]

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AdddoctorsdialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
     private firebaseCollectionService: FirebaseCollectionService
  ) { 
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.adddoctorslist()
    this.getuserdata()
 
    if (this.action === 'Update') {
      this.doctorsForm.controls['doctorsName'].setValue(this.local_data.doctorsName)
      this.doctorsForm.controls['department'].setValue(this.local_data.department)
      this.doctorsForm.controls['degree'].setValue(this.local_data.degree)
      this.doctorsForm.controls['mobileNumber'].setValue(this.local_data.mobileNumber)
      this.doctorsForm.controls['email'].setValue(this.local_data.email)
      this.doctorsForm.controls['joiningDate'].setValue(this.convertTimestamp(this.local_data.joiningDate))
      this.doctorsForm.controls['experience'].setValue(this.local_data.experience)
      this.doctorsForm.controls['consultationFee'].setValue(this.local_data.consultationFee)
      this.doctorsForm.controls['userName'].setValue(this.local_data.userName)
      this.doctorsForm.controls['password'].setValue(this.local_data.password)
    }
  }

   getuserdata(){
    this.firebaseCollectionService.getDocuments('Admin', 'userlist').then((user) => {
      if(user && user.length >0) {
        this.userList = user 
              this.setDuplicateValidators();
      }

    })
  }
  
  convertTimestamp(element : any): Date | null {
    if(element instanceof Timestamp){
      return element.toDate();
    }
    return null;
      }

  adddoctorslist() {
    this.doctorsForm = this.fb.group({
      doctorsName: ['', Validators.required],
      department: ['', Validators.required],
      degree: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      email: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      joiningDate: [new Date(), Validators.required],
      experience: ['', Validators.required],
      consultationFee: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  doAction(){ 
    const payload = {
      id: this.local_data.id ? this.local_data.id : '',
    doctorsName:this.doctorsForm.value.doctorsName,
    department:this.doctorsForm.value.department,
    degree:this.doctorsForm.value.degree,
    mobileNumber:this.doctorsForm.value.mobileNumber,
    email:this.doctorsForm.value.email,
    joiningDate: this.doctorsForm.value.joiningDate,
    experience: this.doctorsForm.value.experience,
    consultationFee: this.doctorsForm.value.consultationFee,
    userName:this.doctorsForm.value.userName,
    password:this.doctorsForm.value.password,
    userId:localStorage.getItem("userId"),
    clinicId:localStorage.getItem("clinicId"),
     userType:"Doctor",
  }
  this.dialogRef.close({ event: this.action, data: payload });
}

userNameExistsValidator(userList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || !userList) return null;

    const input = control.value.trim().toLowerCase();

    const exists = userList.some(
      (u: any) => (u.userName || '').trim().toLowerCase() === input
    );

    return exists ? { userNameExists: true } : null;
  };
}

passwordExistsValidator(userList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || !userList) return null;

    const input = control.value.trim().toLowerCase();

    const exists = userList.some(
      (u: any) => (u.password || '').trim().toLowerCase() === input
    );

    return exists ? { passwordExists: true } : null;
  };
}

setDuplicateValidators() {
  const userNameControl = this.doctorsForm.get('userName');
  const passwordControl = this.doctorsForm.get('password');

  userNameControl?.setValidators([
    Validators.required,
    this.userNameExistsValidator(this.userList)
  ]);

  passwordControl?.setValidators([
    Validators.required,
    this.passwordExistsValidator(this.userList)
  ]);

  userNameControl?.updateValueAndValidity();
  passwordControl?.updateValueAndValidity();
}

}
