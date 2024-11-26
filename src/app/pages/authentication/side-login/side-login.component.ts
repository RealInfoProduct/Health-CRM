import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent implements OnInit  {
  options = this.settings.getOptions();

  userTypeList:any = [
    {id:1 , typeName:'Admin'},
    {id:2 , typeName:'Medical'},
    {id:3 , typeName:'Patient'},
    {id:4 , typeName:'Doctor'}
  ]

  constructor(private settings: CoreService, private router: Router ,private authService:AuthService) {}

  ngOnInit() {}

  form = new FormGroup({
    userType: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.valid) {
      const { email, password, userType } = this.form.value;
      this.authService.signIn(email, password, userType).catch(error => {
        console.error("Login failed", error);
      });
    } else {
      console.log('Form is invalid');
    }

}

}