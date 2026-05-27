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


  userTypeList:any = [
    //  {id:1 , typeName:'Admin'},
    // {id:1 , typeName:'Clinic'},
    // {id:2 , typeName:'Receptionist'},
    // {id:3 , typeName:'Doctor'},
    // {id:4 , typeName:'Medical'},
    // {id:5 , typeName:'Laboratory'},
  ]

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
    // this.getReceptionistData()
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
        console.log(this.clinicList);

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

//   submit() {
//   if (this.form.valid) {
//     const { email, password, userType } = this.form.value;
//     if (userType === 'Clinic') {
//       // Check in clinicList
//       const clinicUser = this.clinicList.find(
//         (clinic: any) => clinic.userName === email && clinic.password === password
//       );
//       if (clinicUser) {
//         // Doctor credentials are valid
//         console.log('Clinic login successful');
//         localStorage.setItem('userEmail', clinicUser.userName);
//         localStorage.setItem('usertype', clinicUser.userType);
//         localStorage.setItem('userId', clinicUser.userId);
//         localStorage.setItem('clinicId', clinicUser.id);
//         this.router.navigate(['/dashboards/dashboard1']); 
//       } else {
//         console.error('Invalid Clinic credentials');
//       }

//     } else if (userType === 'Doctor') {

//       // Step 1: userlist ma doctor login check
//       const doctorsUser = this.userList.find(
//         (user: any) =>
//           user.userName === email &&
//           user.password === password &&
//           user.userType === 'Doctor'
//       );

//       if (doctorsUser) {
//         console.log('Doctor credentials matched');

//         // Step 2: doctorId thi doctorsList mathi data fetch karo
//         this.firebaseCollectionService
//           .getDoctors(
//             doctorsUser.userId,     // clinic owner userId
//             doctorsUser.clinicId,   // clinicId
//             'doctorsList'
//           )
//           .then((doctors) => {

//             // doctor find by id
//             const doctorData = doctors.find(
//               (doc: any) => doc.id === doctorsUser.doctors
//             );

//             if (doctorData) {

//               console.log('Doctor login successful', doctorData);

//               localStorage.setItem('userEmail', doctorData.userName);
//               localStorage.setItem('usertype', 'Doctor');
//               localStorage.setItem('doctorId', doctorData.id);
//               localStorage.setItem('clinicId', doctorsUser.clinicId);
//               localStorage.setItem('userId', doctorsUser.userId);

//               this.router.navigate(['/dashboards/dashboard1']);
//               this.snackBar.open('Login successful', 'Close', {
//                 duration: 3000,
//                 horizontalPosition: 'right',
//                 verticalPosition: 'top',
//               });

//             } else {
//               this.snackBar.open('User data not found!', 'Close', {
//                 duration: 3000,
//                 horizontalPosition: 'right',
//                 verticalPosition: 'top',
//               });
//               throw new Error('User data not found.');
//             }

//           })
//           .catch((error) => {
//             console.error('Error fetching doctor data', error);
//           });

//       } else {
//         this.snackBar.open('User data not found!', 'Close', {
//           duration: 3000,
//           horizontalPosition: 'right',
//           verticalPosition: 'top',
//         });
//         throw new Error('User data not found.');
//       }
//     }
//     else if (userType === 'Receptionist') {

//       // Step 1: userlist ma doctor login check
//       const ReceptionistUser = this.userList.find(
//         (user: any) =>
//           user.userName === email &&
//           user.password === password &&
//           user.userType === 'Receptionist'
//       );

//       if (ReceptionistUser) {
//         console.log('Receptionist credentials matched');

//         // Step 2: receptionistId thi receptionistList mathi data fetch karo
//         this.firebaseCollectionService
//           .getReceptionist(
//             ReceptionistUser.userId,     // clinic owner userId
//             ReceptionistUser.clinicId,   // clinicId
//             'Receptionistlist'
//           )
//           .then((receptionist) => {

//             // receptionist find by id
//             const ReceptionistData = receptionist.find(
//               (doc: any) => doc.id === ReceptionistUser.receptionist
//             );

//             if (ReceptionistData) {

//               console.log('Receptionist login successful', ReceptionistData);

//               localStorage.setItem('userEmail', ReceptionistData.userName);
//               localStorage.setItem('usertype', 'Receptionist');
//               localStorage.setItem('ReceptionistId', ReceptionistData.id);
//               localStorage.setItem('clinicId', ReceptionistUser.clinicId);
//               localStorage.setItem('userId', ReceptionistUser.userId);

//               this.router.navigate(['/dashboards/dashboard1']);
//               this.snackBar.open('Login successful', 'Close', {
//                 duration: 3000,
//                 horizontalPosition: 'right',
//                 verticalPosition: 'top',
//               });

//             } else {
//               this.snackBar.open('User data not found!', 'Close', {
//                 duration: 3000,
//                 horizontalPosition: 'right',
//                 verticalPosition: 'top',
//               });
//               throw new Error('User data not found.');
//             }

//           })
//           .catch((error) => {
//             console.error('Error fetching doctor data', error);
//           });

//       } else {
//         this.snackBar.open('User data not found!', 'Close', {
//           duration: 3000,
//           horizontalPosition: 'right',
//           verticalPosition: 'top',
//         });
//         throw new Error('User data not found.');
//       }
//     }
//     else if (userType === 'Medical') {

//       // Step 1: userlist ma doctor login check
//       const MedicalUser = this.userList.find(
//         (user: any) =>
//           user.userName === email &&
//           user.password === password &&
//           user.userType === 'Medical'
//       );

//       if (MedicalUser) {
//         console.log('Medical credentials matched');

//         // Step 2: MedicalId thi MedicalList mathi data fetch karo
//         this.firebaseCollectionService
//           .getMedical(
//             MedicalUser.userId,     // clinic owner userId
//             MedicalUser.clinicId,   // clinicId
//             'medicallist'
//           )
//           .then((Medical) => {
//             // Medical find by id
//             const MedicalData = Medical.find(
//               (doc: any) => doc.id === MedicalUser.Medical
//             );

//             if (MedicalData) {

//               console.log('Medical login successful', MedicalData);

//               localStorage.setItem('userEmail', MedicalData.userName);
//               localStorage.setItem('usertype', 'Medical');
//               localStorage.setItem('MedicalId', MedicalData.id);
//               localStorage.setItem('clinicId', MedicalUser.clinicId);
//               localStorage.setItem('userId', MedicalUser.userId);

//               this.router.navigate(['/dashboards/dashboard1']);
//               this.snackBar.open('Login successful', 'Close', {
//                 duration: 3000,
//                 horizontalPosition: 'right',
//                 verticalPosition: 'top',
//               });

//             } else {
//               this.snackBar.open('User data not found!', 'Close', {
//                 duration: 3000,
//                 horizontalPosition: 'right',
//                 verticalPosition: 'top',
//               });
//               throw new Error('User data not found.');
//             }

//           })
//           .catch((error) => {
//             console.error('Error fetching doctor data', error);
//           });

//       } else {
//         this.snackBar.open('User data not found!', 'Close', {
//           duration: 3000,
//           horizontalPosition: 'right',
//           verticalPosition: 'top',
//         });
//         throw new Error('User data not found.');
//       }
//     } 
//     else if (userType === 'Laboratory') {

//       // Step 1: userlist ma doctor login check
//       const LaboratoryUser = this.userList.find(
//         (user: any) =>
//           user.userName === email &&
//           user.password === password &&
//           user.userType === 'Laboratory'
//       );

//       if (LaboratoryUser) {
//         console.log('Laboratory credentials matched');

//         // Step 2: LaboratoryId thi LaboratoryList mathi data fetch karo
//         this.firebaseCollectionService
//           .getlaboratory(
//             LaboratoryUser.userId,     // clinic owner userId
//             LaboratoryUser.clinicId,   // clinicId
//             'laboratorylist'
//           )
//           .then((Laboratory) => {
//             // Laboratory find by id
//             debugger
//             const LaboratoryData = Laboratory.find(
//               (doc: any) => doc.id === LaboratoryUser.laboratory
//             );

//             if (LaboratoryData) {

//               console.log('Laboratory login successful', LaboratoryData);

//               localStorage.setItem('userEmail', LaboratoryData.userName);
//               localStorage.setItem('usertype', 'Laboratory');
//               localStorage.setItem('LaboratoryId', LaboratoryData.id);
//               localStorage.setItem('clinicId', LaboratoryUser.clinicId);
//               localStorage.setItem('userId', LaboratoryUser.userId);

//               this.router.navigate(['/dashboards/dashboard1']);
//               this.snackBar.open('Login successful', 'Close', {
//                 duration: 3000,
//                 horizontalPosition: 'right',
//                 verticalPosition: 'top',
//               });

//             } else {
//               this.snackBar.open('User data not found!', 'Close', {
//                 duration: 3000,
//                 horizontalPosition: 'right',
//                 verticalPosition: 'top',
//               });
//               throw new Error('User data not found.');
//             }

//           })
//           .catch((error) => {
//             console.error('Error fetching doctor data', error);
//           });

//       } else {
//         this.snackBar.open('User data not found!', 'Close', {
//           duration: 3000,
//           horizontalPosition: 'right',
//           verticalPosition: 'top',
//         });
//         throw new Error('User data not found.');
//       }
//     } 
//     else {
//       // For other user types, use authService
//       this.authService.signIn(email, password, userType)
//         .then(() => {
//           console.log(`${userType} login successful`);
//         })
//         .catch(error => {
//           console.error('Login failed', error);
//         });
//     }

//   } else {
//     console.log('Form is invalid');
//   }
// }

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
    // else if (loginUser && loginUser.userType === 'Receptionist') {
    //   debugger
    //   localStorage.setItem('userEmail', loginUser.userName);
    //   localStorage.setItem('usertype', loginUser.userType);
    //   localStorage.setItem('userId', loginUser.userId);
    //   localStorage.setItem('ReceptionistId', loginUser.receptionist);
    //     localStorage.setItem('doctorId', loginUser.doctors);
    //   localStorage.setItem('clinicId', loginUser.clinicId);

    //   this.router.navigate(['/dashboards/dashboard1']);

    //   this.snackBar.open('Login successful', 'Close', {
    //     duration: 3000,
    //     horizontalPosition: 'right',
    //     verticalPosition: 'top',
    //   });

    // }
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

        console.log('All Doctor IDs => ', allDoctorIds);

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