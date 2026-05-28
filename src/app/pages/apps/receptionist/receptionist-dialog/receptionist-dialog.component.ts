import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-receptionist-dialog',
  templateUrl: './receptionist-dialog.component.html',
  styleUrls: ['./receptionist-dialog.component.scss']
})
export class ReceptionistDialogComponent implements OnInit {
  receptionistForm: FormGroup;
  action: string;
  local_data: any;
  hidePassword: boolean = true;
userList:any =[]

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReceptionistDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
      private firebaseCollectionService: FirebaseCollectionService

  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.addmedicallist()
    this.getuserdata()
    if (this.action === 'Update') {
      this.receptionistForm.controls['firstName'].setValue(this.local_data.firstName)
      this.receptionistForm.controls['middleName'].setValue(this.local_data.middleName)
      this.receptionistForm.controls['lastName'].setValue(this.local_data.lastName)
      this.receptionistForm.controls['mobileNumber'].setValue(this.local_data.mobileNumber)
      this.receptionistForm.controls['email'].setValue(this.local_data.email)
      this.receptionistForm.controls['address'].setValue(this.local_data.address)
      this.receptionistForm.controls['userName'].setValue(this.local_data.userName)
      this.receptionistForm.controls['password'].setValue(this.local_data.password)
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
  

  addmedicallist() {
    this.receptionistForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      email: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      address: [''],
      userName: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  doAction(): void {
    const payload = {
        id: this.local_data.id ? this.local_data.id : '',
      firstName: this.receptionistForm.value.firstName,
      middleName: this.receptionistForm.value.middleName,
      lastName: this.receptionistForm.value.lastName,
      mobileNumber: this.receptionistForm.value.mobileNumber,
      email: this.receptionistForm.value.email,
      address: this.receptionistForm.value.address,
      userName:this.receptionistForm.value.userName,
      password:this.receptionistForm.value.password,
      userId:localStorage.getItem("userId"),
      clinicId:localStorage.getItem("clinicId"),
      userType:"Receptionist",
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
    const userNameControl = this.receptionistForm.get('userName');
    const passwordControl = this.receptionistForm.get('password');
  
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