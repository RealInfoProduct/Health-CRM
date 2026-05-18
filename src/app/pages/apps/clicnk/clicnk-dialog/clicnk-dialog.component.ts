import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';

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
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.adddoctorslist()
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
  console.log(payload);

  this.dialogRef.close({ event: this.action, data: payload });
}

}
