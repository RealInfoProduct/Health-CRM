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


  async signIn(email: string, password: string, userType: string) {
    try {
      // Authenticate user with Firebase
      const result: any = await this.afAuth.signInWithEmailAndPassword(email, password);
  
      // Fetch user data from Firestore
      const userDoc = await this.firestore
        .collection(this.getCollectionByUserType(userType)) // Use the userType to fetch from the correct collection
        .doc(result.user?.uid)
        .get(result.uid?.subCollectionName )
        .toPromise();
  
      const userData: any = userDoc?.data();
  
      // Verify that user data exists
      if (!userData) {
        this.snackBar.open('User data not found!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        throw new Error('User data not found.');
      }
  
      // Check if account is active
      if (userData.isDisabled) {
        this.snackBar.open('This account is not active!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        throw new Error('This account is not active.');
      }
  
      // Check if userType matches
      if (userData.userType !== userType) {
        this.snackBar.open('Incorrect user type!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        throw new Error('User type mismatch.');
      }
  
      // Store user information in local storage
      localStorage.setItem('userId', result.user?._delegate?.uid);
      localStorage.setItem('userEmail', result.user?._delegate?.email);
      localStorage.setItem('usertype', userData.userType);
  
      // Navigate to the dashboard and show success message
      this.router.navigate(['/dashboards/dashboard1']);
      this.snackBar.open('Login successful', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
  
      return result;
    } catch (error) {
      console.error('Error signing in', error);
  
      // Display error message
      this.snackBar.open(`${error.message || 'An error occurred during login.'}`, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
  
      throw error;
    }
  }



    async signUp(signUpData: any) {
  try {
    // Create user with email and password
    const result: any = await this.afAuth.createUserWithEmailAndPassword(
      signUpData.email,
      signUpData.password
    );

    // Determine collection name based on userType
    const collectionName = this.getCollectionByUserType(signUpData.userType);

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
      isDisabled: true,
    };

    // Main collection ma save
    await this.firestore
      .collection(collectionName)
      .doc(result.user?.uid)
      .set(userData);

    // Success message
    this.snackBar.open(
      `Account created: ${result.user._delegate.email}`,
      'Close',
      {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      }
    );

    return result;

  } catch (error) {

    this.snackBar.open(`${error}`, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });

    throw error;
  }
}

  // Helper method to get the collection name based on userType
  private getCollectionByUserType(userType: string): string {
    switch (userType) {
      case 'Doctor':
        return 'Doctor';
      case 'Clinic':
        return 'Clinic';
      case 'Laboratory':
        return 'Laboratory';
      case 'Receptionist':
        return 'Receptionist';
      case 'Patient':
        return 'Patient';
      case 'Admin':
        return 'Admin';
      case 'Medical':
        return 'Medical';
      default:
        return 'ClinicList'; 
    }
  }
  
  

  // Sign out
  async signOut() {
    await this.afAuth.signOut();
    localStorage.removeItem('uid'); 
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('usertype');
    localStorage.removeItem('clinicId');
    localStorage.removeItem('ReceptionistId');
    localStorage.removeItem('doctorId');
  }
  // Sign out
// async signOut() {
//   try {
//     await this.afAuth.signOut();

//     localStorage.removeItem('uid'); 
//     localStorage.removeItem('userId');
//     localStorage.removeItem('userEmail');
//     localStorage.removeItem('usertype');
//     localStorage.removeItem('clinicId');

//     // Optional: navigate to login page
//     this.router.navigate(['/authentication/side-login']);

//     this.snackBar.open('You have been signed out.', 'Close', {
//       duration: 3000,
//       horizontalPosition: 'right',
//       verticalPosition: 'top',
//     });
//   } catch (error) {
//     console.error('Error signing out', error);
//     this.snackBar.open('Error signing out. Please try again.', 'Close', {
//       duration: 3000,
//       horizontalPosition: 'right',
//       verticalPosition: 'top',
//     });
//     throw error;
//   }
// }

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
