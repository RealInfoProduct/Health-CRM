import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { NgIf } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './side-register.component.html',
})
export class AppSideRegisterComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService, private router: Router, private authService:AuthService) {}

  form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    mobileNumber:new FormControl ('', [Validators.required, Validators.pattern("[0-9 ]{10}")]),
    clinicName: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    const registerUserData = {
    firstName: this.form.value.firstName,
    lastName: this.form.value.lastName,
    mobileNumber: this.form.value.mobileNumber,
    clinicName: this.form.value.clinicName,
    address: this.form.value.address,
    email: this.form.value.email,
    password: this.form.value.password,
    }
    const registerSuccess:any = this.authService.signUp(registerUserData)
    if(registerSuccess){
      this.form.reset()
    }
  }
}
