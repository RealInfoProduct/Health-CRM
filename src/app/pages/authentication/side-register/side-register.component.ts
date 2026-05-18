import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './side-register.component.html',
})
export class AppSideRegisterComponent {
  options = this.settings.getOptions();

  userTypeList = [
     {id:1 , typeName:'Admin'},
    // {id:2 , typeName:'Doctor'},
    // {id:3 , typeName:'Medical'},
    // {id:4 , typeName:'Clinic'},
    // {id:5 , typeName:'Laboratory'},
    // {id:6 , typeName:'Receptionist'},
    // {id:3 , typeName:'Patient'}
  ]

  constructor(private settings: CoreService, private router: Router, private authService:AuthService) {}

  form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    mobileNumber:new FormControl ('', [Validators.required, Validators.pattern("[0-9 ]{10}")]),
    clinicName: new FormControl('', [Validators.required]),
    medicalName: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    userType: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    const registerUserData = {
    firstName: this.form.value.firstName,
    lastName: this.form.value.lastName,
    mobileNumber: this.form.value.mobileNumber,
    clinicName: this.form.value.clinicName || '',
    medicalName: this.form.value.medicalName,
    address: this.form.value.address,
    email: this.form.value.email,
    password: this.form.value.password,
    userType: this.form.value.userType,
    }
    const registerSuccess:any = this.authService.signUp(registerUserData)
    if(registerSuccess){
      this.form.reset()
    }
  }
}
