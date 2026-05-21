import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';


@Component({
  selector: 'app-addmedicaldialog',
  templateUrl: './addmedicaldialog.component.html',
  styleUrls: ['./addmedicaldialog.component.scss']
})
export class AddmedicaldialogComponent implements OnInit {
  addmedicalForm: FormGroup;
  action: string;
  local_data: any;
  hidePassword: boolean = true;
   userList:any =[]

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddmedicaldialogComponent>,
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
      this.addmedicalForm.controls['firstName'].setValue(this.local_data.firstName)
      this.addmedicalForm.controls['middleName'].setValue(this.local_data.middleName)
      this.addmedicalForm.controls['lastName'].setValue(this.local_data.lastName)
      this.addmedicalForm.controls['medicalName'].setValue(this.local_data.medicalName)
      this.addmedicalForm.controls['mobileNumber'].setValue(this.local_data.mobileNumber)
      this.addmedicalForm.controls['middleEmail'].setValue(this.local_data.middleEmail)
      this.addmedicalForm.controls['address'].setValue(this.local_data.address)
      this.addmedicalForm.controls['userName'].setValue(this.local_data.userName)
      this.addmedicalForm.controls['password'].setValue(this.local_data.password)
    }
  }

  getuserdata() {
    this.firebaseCollectionService.getDocuments('Admin', 'userlist').then((user) => {
      if (user && user.length > 0) {
        this.userList = user
        console.log(this.userList);
        this.setDuplicateValidators();
      }

    })
  }

  addmedicallist() {
    this.addmedicalForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
      medicalName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      middleEmail: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      address: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  doAction(): void {
    const payload = {
        id: this.local_data.id ? this.local_data.id : '',
      firstName: this.addmedicalForm.value.firstName,
      middleName: this.addmedicalForm.value.middleName,
      lastName: this.addmedicalForm.value.lastName,
      medicalName: this.addmedicalForm.value.medicalName,
      mobileNumber: this.addmedicalForm.value.mobileNumber,
      middleEmail: this.addmedicalForm.value.middleEmail,
      address: this.addmedicalForm.value.address,
      userName:this.addmedicalForm.value.userName,
      password:this.addmedicalForm.value.password,
      userId:localStorage.getItem("userId"),
      clinicId:localStorage.getItem("clinicId"),
      userType:"Medical",
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
      const userNameControl = this.addmedicalForm.get('userName');
      const passwordControl = this.addmedicalForm.get('password');
    
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