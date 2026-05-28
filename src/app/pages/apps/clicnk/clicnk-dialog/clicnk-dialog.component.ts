import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-clicnk-dialog',
  templateUrl: './clicnk-dialog.component.html',
  styleUrls: ['./clicnk-dialog.component.scss']
})
export class ClicnkDialogComponent implements OnInit {
   clinicForm: FormGroup;
  action: string;
  local_data: any;

hidePassword: boolean = true;
 userId:any = localStorage.getItem('uid')
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ClicnkDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
         private firebaseCollectionService: FirebaseCollectionService
  ) { 
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }
userList:any =[]
  ngOnInit(): void {
    this.adddoctorslist()
    this.getuserdata()
    if (this.action === 'Update') {
      this.clinicForm.controls['clicnkName'].setValue(this.local_data.clicnkName)
      this.clinicForm.controls['degree'].setValue(this.local_data.degree)
      this.clinicForm.controls['doctorsName'].setValue(this.local_data.doctorsName)
      this.clinicForm.controls['mobileNumber'].setValue(this.local_data.mobileNumber)
      this.clinicForm.controls['email'].setValue(this.local_data.email)
      this.clinicForm.controls['address'].setValue(this.local_data.address)
      this.clinicForm.controls['userName'].setValue(this.local_data.userName)
      this.clinicForm.controls['password'].setValue(this.local_data.password)
    }
  }
  
  convertTimestamp(element : any): Date | null {
    if(element instanceof Timestamp){
      return element.toDate();
    }
    return null;
      }

        getuserdata(){
    this.firebaseCollectionService.getDocuments('Admin', 'userlist').then((user) => {
      if(user && user.length >0) {
        this.userList = user 
              this.setDuplicateValidators();
      }

    })
  }

  adddoctorslist() {
    this.clinicForm = this.fb.group({
      clicnkName: ['', Validators.required],
      degree: ['', Validators.required],
      doctorsName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      email: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      address: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
     
    })
  }

  doAction(){ 
    const payload = {
         id: this.local_data.id ? this.local_data.id : '',
    clicnkName:this.clinicForm.value.clicnkName,
    degree:this.clinicForm.value.degree,
    doctorsName:this.clinicForm.value.doctorsName,
    mobileNumber:this.clinicForm.value.mobileNumber,
    email:this.clinicForm.value.email,
    address:this.clinicForm.value.address,
    userName:this.clinicForm.value.userName,
    password:this.clinicForm.value.password,
    userId:localStorage.getItem("userId"),
    userType:"Clinic",
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
  const userNameControl = this.clinicForm.get('userName');
  const passwordControl = this.clinicForm.get('password');

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
