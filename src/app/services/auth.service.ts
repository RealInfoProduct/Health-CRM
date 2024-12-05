import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class  AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private snackBar: MatSnackBar,
    private firestore: AngularFirestore,
    private router: Router
  ) { }

  // Sign in with email and password
  async signIn(email: any, password: any, userType:any ) {
    try {
      const result:any = await this.afAuth.signInWithEmailAndPassword(email, password);
      
      // Fetch user data from Firestore
      const userDoc = await this.firestore.collection('ClinicList').doc(result.user?.uid).get().toPromise();
      const userData :any = userDoc?.data();

      if (userData?.isDisabled) {
        this.snackBar.open('This account is not active!!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        throw new Error("This account is not active.");
      }

      if(userData?.userType !== userType){
        this.snackBar.open('Incorrect user type!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        throw new Error('User type mismatch.');
      }

      localStorage.setItem('uid', result.user._delegate.uid);
      localStorage.setItem('userEmail', result.user._delegate.email);
      localStorage.setItem('usertype', userData.userType);
      
      this.router.navigate(['/dashboards/dashboard1']);
      this.snackBar.open('Login successful', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return result;
  
    } catch (error) {
      console.error("Error signing in", error);
      this.snackBar.open(`${error}`, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      throw error;
    }
  }

  
  

  //  async signUp(signUpData :any) {
  //   try {
  //     const result:any = await this.afAuth.createUserWithEmailAndPassword(signUpData.email, signUpData.password);

  //     await this.firestore.collection('ClinicList').doc(result.user?.uid).set({
  //       firstName: signUpData.firstName,
  //       lastName: signUpData.lastName,
  //       mobileNumber: signUpData.mobileNumber,
  //       clinicName: signUpData.clinicName,
  //       address: signUpData.address,
  //       email: signUpData.email,
  //       password: signUpData.password,
  //       userName: signUpData.userName,
  //       isDisabled: true
  //     });
      
  //     this.snackBar.open(`Account created: ${result.user._delegate.email}`, 'Close', {
  //       duration: 3000,
  //       horizontalPosition: 'right',
  //       verticalPosition: 'top',
  //     });
  //     return result;
  //   } catch (error) {
  //     this.snackBar.open(`${error}`, 'Close', {
  //       duration: 3000,
  //       horizontalPosition: 'right',
  //       verticalPosition: 'top',
  //     });
  //     throw error;
  //   }
  // }



async signUp(signUpData: any) {
  try {
    // Check if the email is already in use
    const signInMethods = await this.afAuth.fetchSignInMethodsForEmail(signUpData.email);
    if (signInMethods.length > 0) {
      this.snackBar.open('This email address is already registered. Please use another email.', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      throw new Error('Email address is already in use.');
    }

    // Create the new user
    const result: any = await this.afAuth.createUserWithEmailAndPassword(signUpData.email, signUpData.password);

    // Define user data
    const userData = {
      firstName: signUpData.firstName,
      lastName: signUpData.lastName,
      mobileNumber: signUpData.mobileNumber,
      clinicName: signUpData.clinicName,
      medicalName: signUpData.medicalName,
      address: signUpData.address,
      email: signUpData.email,
      password: signUpData.password,
      userType: signUpData.userType,
      isDisabled: true, // Set the account as disabled initially
    };

    // Save user data to Firestore under 'ClinicList'
    const userDocRef = this.firestore.collection('ClinicList').doc(result.user?.uid);
    await userDocRef.set(userData);

    // Add user data to the appropriate subcollection based on userType
    const validUserTypes = ['Admin', 'Medical', 'Patient', 'Doctor'];
    const userType = signUpData.userType;

    if (validUserTypes.includes(userType)) {
      await userDocRef.collection(userType).doc(result.user?.uid).set(userData);
    } else {
      throw new Error(`Invalid userType: ${userType}`);
    }

    // Show success message
    this.snackBar.open(`Account created successfully for: ${result.user.email}`, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });

    return result; // Return result for further processing if needed

  } catch (error) {
    console.error('Error during sign-up:', error);
    this.snackBar.open(`Error: ${error.message}`, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
    throw error; // Propagate error for external handling if required
  }
}



  

  // Sign out
  async signOut() {
    await this.afAuth.signOut();
  }

  // Sign in with Google
  async googleSignIn() {
    try {
      const result = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      return result;
    } catch (error) {
      console.error("Error with Google sign in", error);
      throw error;
    }
  }

// Forgot Password
async forgotPassword(email: any) {
  try {
    await this.afAuth.sendPasswordResetEmail(email);
    this.snackBar.open('Password reset email sent. Please check your inbox.', 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  } catch (error) {
    console.error('Error sending password reset email', error);
    this.snackBar.open(`Failed to send password reset email: ${error}`, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
    throw error;
  }
}

}
