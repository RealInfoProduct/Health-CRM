import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent implements OnInit  {
  options = this.settings.getOptions();

clinicList:any =[]
doctorslist:any =[]
userList:any =[]
receptionistList:any =[]

  constructor(
    private settings: CoreService, 
    private router: Router,
    private authService:AuthService,
      private firebaseCollectionService: FirebaseCollectionService,
       private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.getclicnkdata()
    this.getuserdata()
  }
  form = new FormGroup({
    userType: new FormControl(''),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

//   submit() {
//     if (this.form.valid) {
//       const { email, password, userType } = this.form.value;
//       this.authService.signIn(email, password, userType).catch(error => {
//         console.error("Login failed", error);
//       });
//     } else {
//       console.log('Form is invalid');
//     }

// }
  getclicnkdata() {
  this.firebaseCollectionService
    .getDocuments('Admin', 'clinicList')
    .then((clicnk) => {

      if (clicnk && clicnk.length > 0) {

        this.clinicList = clicnk;

        this.clinicList.forEach((clinicData: any) => {

          // Pass userId and clinicId
          this.getdoctorsdata(
            clinicData.userId,
            clinicData.id
          );

        });
      }
    });
}

    getdoctorsdata(userId: string, clinicId: string) {
    this.firebaseCollectionService.getDoctors(userId, clinicId,'doctorsList').then((doctors) => {  
      if (doctors && doctors.length > 0) {
        this.doctorslist = doctors
      }
    })
  }
    getReceptionistData(userId: string, clinicId: string) {
    this.firebaseCollectionService.getReceptionist(userId, clinicId,'Receptionistlist').then((Receptionist) => {  
      if (Receptionist && Receptionist.length > 0) {
        this.receptionistList = Receptionist
      }
    })
  }

  
  getuserdata(){
    this.firebaseCollectionService.getDocuments('Admin', 'userlist').then((user) => {
      if(user && user.length >0) {
        this.userList = user 
      }

    })
  }


submit() {

  if (this.form.valid) {

    const { email, password } = this.form.value;

    // check username & password
    const loginUser = this.userList.find(
      (user: any) =>
        user.userName === email &&
        user.password === password
    );

    // login success
    if (loginUser && loginUser.userType === 'Clinic') {
      localStorage.setItem('userEmail', loginUser.userName);
      localStorage.setItem('usertype', loginUser.userType);
      localStorage.setItem('userId', loginUser.userId);
      localStorage.setItem('clinicId', loginUser.clinicId);

      this.router.navigate(['/dashboards/dashboard1']);

      this.snackBar.open('Login successful', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

    } 
     else if (loginUser && loginUser.userType === 'Doctor') {
      localStorage.setItem('userEmail', loginUser.userName);
      localStorage.setItem('usertype', loginUser.userType);
      localStorage.setItem('userId', loginUser.userId);
      localStorage.setItem('doctorId', loginUser.doctors);
      localStorage.setItem('clinicId', loginUser.clinicId);

      this.router.navigate(['/dashboards/dashboard1']);

      this.snackBar.open('Login successful', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

    } 
    else if (loginUser && loginUser.userType === 'Laboratory') {
      localStorage.setItem('userEmail', loginUser.userName);
      localStorage.setItem('usertype', loginUser.userType);
      localStorage.setItem('userId', loginUser.userId);
      localStorage.setItem('LaboratoryId', loginUser.laboratory);
      localStorage.setItem('clinicId', loginUser.clinicId);

      this.router.navigate(['/dashboards/dashboard1']);

      this.snackBar.open('Login successful', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

    }
  else if (loginUser && loginUser.userType === 'Receptionist') {

  this.firebaseCollectionService
    .getDoctors(
      loginUser.userId,
      loginUser.clinicId,
      'doctorsList'
    )
    .then((doctors: any[]) => {

      if (doctors && doctors.length > 0) {

        // all doctor ids
        const allDoctorIds = doctors.map(
          (doc: any) => doc.id
        );


        // localStorage
        localStorage.setItem(
          'doctorId',
          JSON.stringify(allDoctorIds)
        );

        localStorage.setItem('userEmail', loginUser.userName);
        localStorage.setItem('usertype', loginUser.userType);
        localStorage.setItem('userId', loginUser.userId);
        localStorage.setItem('ReceptionistId', loginUser.receptionist);
        localStorage.setItem('clinicId', loginUser.clinicId);

        this.router.navigate(['/dashboards/dashboard1']);

        this.snackBar.open('Login successful', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });

      }

    })
    .catch((error) => {
      console.log(error);
    });

}
    else if (loginUser && loginUser.userType === 'Medical') {
      localStorage.setItem('userEmail', loginUser.userName);
      localStorage.setItem('usertype', loginUser.userType);
      localStorage.setItem('userId', loginUser.userId);
      localStorage.setItem('MedicalId', loginUser.Medical);
      localStorage.setItem('clinicId', loginUser.clinicId);

      this.router.navigate(['/dashboards/dashboard1']);

      this.snackBar.open('Login successful', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

    }
     else {

      this.snackBar.open('Invalid username or password!', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

    }
  }
}

}