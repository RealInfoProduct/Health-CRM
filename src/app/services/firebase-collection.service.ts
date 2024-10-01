import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseCollectionService {

  constructor(private firestore: AngularFirestore, private snackBar: MatSnackBar,
    private spinnerService: SpinnerService) { }

  // Generic method to add a document to any collection
  async addDocument(collectionName: string, documentData: any, subCollectionName?: string) {
    this.spinnerService.setSpinner(true);
    const companyId: any = localStorage.getItem('uid');
    try {
      let collectionRef:any = this.firestore.collection(collectionName).doc(companyId);
      
      if (subCollectionName) {
        collectionRef = collectionRef.collection(subCollectionName);
      }

      await collectionRef.add(documentData);
      this.snackBar.open('Document added successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    } catch (error: any) {
      this.snackBar.open(`Error adding document: ${error.message}`, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      throw error;
    } finally {
      this.spinnerService.setSpinner(false);
    }
  }

  // Generic method to update a document in any collection
  async updateDocument(collectionName: string, documentId: string, documentData: any, subCollectionName?: string) {
    this.spinnerService.setSpinner(true);
    const companyId: any = localStorage.getItem('uid');
    try {
      let collectionRef = this.firestore.collection(collectionName).doc(companyId);
      
      if (subCollectionName) {
        collectionRef = collectionRef.collection(subCollectionName).doc(documentId);
      } else {
        collectionRef = collectionRef.collection(collectionName).doc(documentId);
      }

      await collectionRef.update(documentData);
      this.snackBar.open('Document updated successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    } catch (error: any) {
      this.snackBar.open(`Error updating document: ${error.message}`, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      throw error;
    } finally {
      this.spinnerService.setSpinner(false);
    }
  }

  // Generic method to delete a document from any collection
  async deleteDocument(collectionName: string, documentId: string, subCollectionName?: string) {
    this.spinnerService.setSpinner(true);
    const companyId: any = localStorage.getItem('uid');
    try {
      let collectionRef = this.firestore.collection(collectionName).doc(companyId);

      if (subCollectionName) {
        collectionRef = collectionRef.collection(subCollectionName).doc(documentId);
      } else {
        collectionRef = collectionRef.collection(collectionName).doc(documentId);
      }

      await collectionRef.delete();
      this.snackBar.open('Document deleted successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    } catch (error: any) {
      this.snackBar.open(`Error deleting document: ${error.message}`, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      throw error;
    } finally {
      this.spinnerService.setSpinner(false);
    }
  }

  // Generic method to get all documents from any collection
  async getDocuments(collectionName: string, subCollectionName?: string) {
    this.spinnerService.setSpinner(true);
    const companyId: any = localStorage.getItem('uid');
    try {
      let collectionRef:any = this.firestore.collection(collectionName).doc(companyId);
      
      if (subCollectionName) {
        collectionRef = collectionRef.collection(subCollectionName);
      }

      const snapshot = await collectionRef.get().toPromise();
      const documents: any[] = [];

      snapshot?.forEach((doc: any) => {
        documents.push({ id: doc.id, ...doc.data() });
      });

      return documents;
    } catch (error: any) {
      this.snackBar.open(`Error fetching documents: ${error.message}`, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      throw error;
    } finally {
      this.spinnerService.setSpinner(false);
    }
  }

}
