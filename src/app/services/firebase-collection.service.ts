import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerService } from './spinner.service';
import { firstValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FirebaseCollectionService {

  constructor(
    private firestore: AngularFirestore,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService) { }

  async addDocument(
    collectionName: string,
    documentData: any,
    subCollectionName?: string
  ) {

    this.spinnerService.setSpinner(true);

    const clinicId: any = localStorage.getItem('userId');

    try {

      let collectionRef: any = this.firestore
        .collection(collectionName)
        .doc(clinicId);

      if (subCollectionName) {
        collectionRef = collectionRef.collection(subCollectionName);
      }

      // Create document reference with auto ID
      const docRef = collectionRef.doc();

      // Set same ID inside document data
      const data = {
        ...documentData,
        id: docRef.ref.id,
      };

      // Save document
      await docRef.set(data);

      this.snackBar.open('Document added successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

      // IMPORTANT
      return data;

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
    const clinicId: any = localStorage.getItem('userId');
    try {
      let collectionRef = this.firestore.collection(collectionName).doc(clinicId);

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
    const clinicId: any = localStorage.getItem('userId');
    try {
      let collectionRef = this.firestore.collection(collectionName).doc(clinicId);

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

    try {
      // Start with the top-level collection
      let collectionRef: any = this.firestore.collection(collectionName);

      // If subCollectionName is provided, we need to fetch all docs in the main collection
      // and then get the subcollections
      if (subCollectionName) {
        const snapshot = await collectionRef.get().toPromise();
        const documents: any[] = [];

        for (const doc of snapshot.docs) {
          const subCollectionSnapshot = await collectionRef
            .doc(doc.id)
            .collection(subCollectionName)
            .get()
            .toPromise();

          subCollectionSnapshot.forEach((subDoc: any) => {
            documents.push({ id: subDoc.id, ...subDoc.data() });
          });
        }

        return documents;
      } else {
        // No subcollection, just return top-level documents
        const snapshot = await collectionRef.get().toPromise();
        const documents: any[] = [];

        snapshot.forEach((doc: any) => {
          documents.push({ id: doc.id, ...doc.data() });
        });

        return documents;
      }
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

  // new Doctor
  async addDoctor(adminId: string, clinicId: string, doctorData: any) {
    this.spinnerService.setSpinner(true);

    try {

      const doctorsRef = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('doctorsList');

      const newDoctorRef = doctorsRef.ref.doc();

      const data = {
        ...doctorData,
        id: newDoctorRef.id
      };

      await newDoctorRef.set(data);

      this.snackBar.open('Doctor added successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

      // 👇 ADD THIS RETURN
      return newDoctorRef.id;

    } catch (error: any) {

      console.error(error);

      this.snackBar.open(`Error: ${error.message}`, 'Close');

      return null;

    } finally {

      this.spinnerService.setSpinner(false);
    }
  }
  async updateDoctor(
    adminId: string,
    clinicId: string,
    doctorId: string,
    doctorData: any
  ) {
    this.spinnerService.setSpinner(true);

    try {
      const ref = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('doctorsList')
        .doc(doctorId);

      await ref.update(doctorData);

      this.snackBar.open('Doctor updated successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    } catch (error: any) {
      this.snackBar.open(`Error updating doctor: ${error.message}`, 'Close', {
        duration: 3000,
      });
      throw error;
    } finally {
      this.spinnerService.setSpinner(false);
    }
  }

  async deleteDoctor(
    adminId: string,
    clinicId: string,
    doctorId: string
  ) {
    this.spinnerService.setSpinner(true);

    try {
      const ref = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('doctorsList')
        .doc(doctorId);

      await ref.delete();

      this.snackBar.open('Doctor deleted successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    } catch (error: any) {
      this.snackBar.open(`Error deleting doctor: ${error.message}`, 'Close', {
        duration: 3000,
      });
      throw error;
    } finally {
      this.spinnerService.setSpinner(false);
    }
  }

  async getDoctors(adminId: string, clinicId: string, collectionName: string) {

    this.spinnerService.setSpinner(true);

    try {

      const snapshot = await this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection(collectionName)
        .get()
        .toPromise();

      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));

    } finally {
      this.spinnerService.setSpinner(false);
    }
  }


  // new Medical
  async addMedical(adminId: string, clinicId: string, MedicalData: any) {
    this.spinnerService.setSpinner(true);

    try {
      const Medical = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('medicallist');
      const newDoctorRef = Medical.ref.doc();

      const data = {
        ...MedicalData,
        id: newDoctorRef.id
      };
      await newDoctorRef.set(data);

      this.snackBar.open('Medical added successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return newDoctorRef.id;

    } catch (error: any) {

      console.error(error);

      this.snackBar.open(`Error: ${error.message}`, 'Close');

      return null;

    } finally {

      this.spinnerService.setSpinner(false);
    }
  }
  async updateMedical(
    adminId: string,
    clinicId: string,
    MedicalId: string,
    MedicalData: any
  ) {
    this.spinnerService.setSpinner(true);

    try {
      const ref = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('medicallist')
        .doc(MedicalId);

      await ref.update(MedicalData);

      this.snackBar.open('Doctor updated successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    } catch (error: any) {
      this.snackBar.open(`Error updating doctor: ${error.message}`, 'Close', {
        duration: 3000,
      });
      throw error;
    } finally {
      this.spinnerService.setSpinner(false);
    }
  }

  async deleteMedical(
    adminId: string,
    clinicId: string,
    MedicalId: string
  ) {
    this.spinnerService.setSpinner(true);

    try {
      const ref = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('medicallist')
        .doc(MedicalId);

      await ref.delete();

      this.snackBar.open('Doctor deleted successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    } catch (error: any) {
      this.snackBar.open(`Error deleting doctor: ${error.message}`, 'Close', {
        duration: 3000,
      });
      throw error;
    } finally {
      this.spinnerService.setSpinner(false);
    }
  }

  async getMedical(adminId: string, clinicId: string, collectionName: string) {

    this.spinnerService.setSpinner(true);

    try {

      const snapshot = await this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection(collectionName)
        .get()
        .toPromise();

      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));

    } finally {
      this.spinnerService.setSpinner(false);
    }
  }


  // new laboratory
  async addlaboratory(adminId: string, clinicId: string, laboratoryData: any) {
    this.spinnerService.setSpinner(true);

    try {
      const laboratory = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('laboratorylist');
      const newDoctorRef = laboratory.ref.doc();

      const data = {
        ...laboratoryData,
        id: newDoctorRef.id
      };
      await newDoctorRef.set(data);

      this.snackBar.open('laboratory added successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return newDoctorRef.id;

    } catch (error: any) {

      console.error(error);

      this.snackBar.open(`Error: ${error.message}`, 'Close');

      return null;

    } finally {

      this.spinnerService.setSpinner(false);
    }
  }
  async updatelaboratory(
    adminId: string,
    clinicId: string,
    laboratoryId: string,
    laboratoryData: any
  ) {
    this.spinnerService.setSpinner(true);

    try {
      const ref = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('laboratorylist')
        .doc(laboratoryId);

      await ref.update(laboratoryData);

      this.snackBar.open('laboratory updated successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    } catch (error: any) {
      this.snackBar.open(`Error updating laboratory: ${error.message}`, 'Close', {
        duration: 3000,
      });
      throw error;
    } finally {
      this.spinnerService.setSpinner(false);
    }
  }

  async deletelaboratory(
    adminId: string,
    clinicId: string,
    laboratoryId: string
  ) {
    this.spinnerService.setSpinner(true);

    try {
      const ref = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('laboratorylist')
        .doc(laboratoryId);

      await ref.delete();

      this.snackBar.open('laboratory deleted successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    } catch (error: any) {
      this.snackBar.open(`Error deleting laboratory: ${error.message}`, 'Close', {
        duration: 3000,
      });
      throw error;
    } finally {
      this.spinnerService.setSpinner(false);
    }
  }

  async getlaboratory(adminId: string, clinicId: string, collectionName: string) {

    this.spinnerService.setSpinner(true);

    try {

      const snapshot = await this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection(collectionName)
        .get()
        .toPromise();

      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));

    } finally {
      this.spinnerService.setSpinner(false);
    }
  }

  // new Receptionist
  async addReceptionist(adminId: string, clinicId: string, ReceptionistData: any) {
    this.spinnerService.setSpinner(true);

    try {
      const Receptionist = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('Receptionistlist');
      const newDoctorRef = Receptionist.ref.doc();

      const data = {
        ...ReceptionistData,
        id: newDoctorRef.id
      };
      await newDoctorRef.set(data);

      this.snackBar.open('Receptionist added successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return newDoctorRef.id;

    } catch (error: any) {

      console.error(error);

      this.snackBar.open(`Error: ${error.message}`, 'Close');

      return null;

    } finally {

      this.spinnerService.setSpinner(false);
    }
  }
  async updateReceptionist(
    adminId: string,
    clinicId: string,
    ReceptionistId: string,
    ReceptionistData: any
  ) {
    this.spinnerService.setSpinner(true);

    try {
      const ref = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('Receptionistlist')
        .doc(ReceptionistId);

      await ref.update(ReceptionistData);

      this.snackBar.open('Receptionist updated successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    } catch (error: any) {
      this.snackBar.open(`Error updatingReceptionist: ${error.message}`, 'Close', {
        duration: 3000,
      });
      throw error;
    } finally {
      this.spinnerService.setSpinner(false);
    }
  }

  async deleteReceptionist(
    adminId: string,
    clinicId: string,
    ReceptionistId: string
  ) {
    this.spinnerService.setSpinner(true);

    try {
      const ref = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('Receptionistlist')
        .doc(ReceptionistId);

      await ref.delete();

      this.snackBar.open('Receptionist deleted successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    } catch (error: any) {
      this.snackBar.open(`Error deleting Receptionist: ${error.message}`, 'Close', {
        duration: 3000,
      });
      throw error;
    } finally {
      this.spinnerService.setSpinner(false);
    }
  }

  async getReceptionist(adminId: string, clinicId: string, collectionName: string) {

    this.spinnerService.setSpinner(true);

    try {

      const snapshot = await this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection(collectionName)
        .get()
        .toPromise();

      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));

    } finally {
      this.spinnerService.setSpinner(false);
    }
  }

  // new appointmentslist
  async addappointmentslist(adminId: string, clinicId: string, receptionistId: string, appointmentsData: any) {
    this.spinnerService.setSpinner(true);

    try {
      const appointments = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('Receptionistlist')
        .doc(receptionistId)
        .collection('appointmentslist');
      const newDoctorRef = appointments.ref.doc();

      const data = {
        ...appointmentsData,
        id: newDoctorRef.id
      };
      await newDoctorRef.set(data);

      this.snackBar.open('Receptionist added successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return newDoctorRef.id;

    } catch (error: any) {

      console.error(error);

      this.snackBar.open(`Error: ${error.message}`, 'Close');

      return null;

    } finally {

      this.spinnerService.setSpinner(false);
    }
  }
  async updateAppointmentsList(
    adminId: string,
    clinicId: string,
    receptionistId: string,
    appointmentId: string,
    appointmentData: any
  ) {

    this.spinnerService.setSpinner(true);

    try {

      const ref = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('Receptionistlist')
        .doc(receptionistId)
        .collection('appointmentslist')
        .doc(appointmentId);

      await ref.update(appointmentData);

      this.snackBar.open('Appointment updated successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

    } catch (error: any) {

      this.snackBar.open(
        `Error updating appointment: ${error.message}`,
        'Close',
        {
          duration: 3000,
        }
      );

      throw error;

    } finally {

      this.spinnerService.setSpinner(false);

    }
  }

  async deleteAppointmentsList(
    adminId: string,
    clinicId: string,
    receptionistId: string,
    appointmentId: string
  ) {

    this.spinnerService.setSpinner(true);

    try {

      const ref = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('Receptionistlist')
        .doc(receptionistId)
        .collection('appointmentslist')
        .doc(appointmentId);

      await ref.delete();

      this.snackBar.open('Appointment deleted successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

    } catch (error: any) {

      this.snackBar.open(
        `Error deleting appointment: ${error.message}`,
        'Close',
        {
          duration: 3000,
        }
      );

      throw error;

    } finally {

      this.spinnerService.setSpinner(false);

    }
  }

  async getAppointmentsList(
    adminId: string,
    clinicId: string,
    receptionistId: string,
    collectionName: string
  ) {

    this.spinnerService.setSpinner(true);

    try {

      const snapshot = await this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('Receptionistlist')
        .doc(receptionistId)
        .collection(collectionName)
        .get()
        .toPromise();

      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));

    } finally {
      this.spinnerService.setSpinner(false);
    }
  }

  // new patient
  async addpatient(adminId: string, clinicId: string, doctorId: string, patientData: any) {
    this.spinnerService.setSpinner(true);

    try {
      const patient = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('doctorsList')
        .doc(doctorId)
        .collection('patientlist');
      const newDoctorRef = patient.ref.doc();

      const data = {
        ...patientData,
        id: newDoctorRef.id
      };
      await newDoctorRef.set(data);

      this.snackBar.open('Patient added successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return newDoctorRef.id;

    } catch (error: any) {

      console.error(error);

      this.snackBar.open(`Error: ${error.message}`, 'Close');

      return null;

    } finally {

      this.spinnerService.setSpinner(false);
    }
  }
  async updatepatient(
    adminId: string,
    clinicId: string,
    doctorId: string,
    patientId: string,
    patientData: any
  ) {

    this.spinnerService.setSpinner(true);

    try {

      const ref = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('doctorsList')
        .doc(doctorId)
        .collection('patientlist')
        .doc(patientId);

      await ref.update(patientData);

      this.snackBar.open('patient updated successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

    } catch (error: any) {

      this.snackBar.open(
        `Error updating patient: ${error.message}`,
        'Close',
        {
          duration: 3000,
        }
      );

      throw error;

    } finally {

      this.spinnerService.setSpinner(false);

    }
  }

  async deletepatient(
    adminId: string,
    clinicId: string,
    doctorId: string,
    patientId: string
  ) {

    this.spinnerService.setSpinner(true);

    try {

      const ref = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('doctorsList')
        .doc(doctorId)
        .collection('patientlist')
        .doc(patientId);

      await ref.delete();

      this.snackBar.open('patient deleted successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

    } catch (error: any) {

      this.snackBar.open(
        `Error deleting patient: ${error.message}`,
        'Close',
        {
          duration: 3000,
        }
      );

      throw error;

    } finally {

      this.spinnerService.setSpinner(false);

    }
  }

  async getpatient(
    adminId: string,
    clinicId: string,
    doctorId: string,
    collectionName: string
  ) {

    this.spinnerService.setSpinner(true);

    try {

      const snapshot = await this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('doctorsList')
        .doc(doctorId)
        .collection(collectionName)
        .get()
        .toPromise();

      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));

    } finally {
      this.spinnerService.setSpinner(false);
    }
  }

  // new lab
  async addlab(adminId: string, clinicId: string, laboratoryId: string, labData: any) {
    this.spinnerService.setSpinner(true);

    try {
      const lab = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('laboratorylist')
        .doc(laboratoryId)
        .collection('lablist');
      const newlaboratoryRef = lab.ref.doc();

      const data = {
        ...labData,
        id: newlaboratoryRef.id
      };
      await newlaboratoryRef.set(data);

      this.snackBar.open('lab added successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return newlaboratoryRef.id;

    } catch (error: any) {

      console.error(error);

      this.snackBar.open(`Error: ${error.message}`, 'Close');

      return null;

    } finally {

      this.spinnerService.setSpinner(false);
    }
  }
  async updatelab(
    adminId: string,
    clinicId: string,
    laboratoryId: string,
    labId: string,
    labData: any
  ) {

    this.spinnerService.setSpinner(true);

    try {

      const ref = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('laboratorylist')
        .doc(laboratoryId)
        .collection('lablist')
        .doc(labId);

      await ref.update(labData);

      this.snackBar.open('lab updated successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

    } catch (error: any) {

      this.snackBar.open(
        `Error updating lab: ${error.message}`,
        'Close',
        {
          duration: 3000,
        }
      );

      throw error;

    } finally {

      this.spinnerService.setSpinner(false);

    }
  }

  async deletelab(
    adminId: string,
    clinicId: string,
    laboratoryId: string,
    labId: string
  ) {

    this.spinnerService.setSpinner(true);

    try {

      const ref = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('laboratorylist')
        .doc(laboratoryId)
        .collection('lablist')
        .doc(labId);

      await ref.delete();

      this.snackBar.open('lab deleted successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

    } catch (error: any) {

      this.snackBar.open(
        `Error deleting lab: ${error.message}`,
        'Close',
        {
          duration: 3000,
        }
      );

      throw error;

    } finally {

      this.spinnerService.setSpinner(false);

    }
  }

  async getlab(
    adminId: string,
    clinicId: string,
    laboratoryId: string,
    collectionName: string
  ) {

    this.spinnerService.setSpinner(true);

    try {

      const snapshot = await this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('laboratorylist')
        .doc(laboratoryId)
        .collection(collectionName)
        .get()
        .toPromise();

      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));

    } finally {
      this.spinnerService.setSpinner(false);
    }
  }

  // new Medicine
  async addMedicine(adminId: string, clinicId: string, MedicineId: string, MedicineData: any) {
    this.spinnerService.setSpinner(true);

    try {
      const medicine = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('medicallist')
        .doc(MedicineId)
        .collection('medicinelist');
      const newmedicallistRef = medicine.ref.doc();

      const data = {
        ...MedicineData,
        id: newmedicallistRef.id
      };
      await newmedicallistRef.set(data);

      this.snackBar.open('Medicine added successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return newmedicallistRef.id;

    } catch (error: any) {

      console.error(error);

      this.snackBar.open(`Error: ${error.message}`, 'Close');

      return null;

    } finally {

      this.spinnerService.setSpinner(false);
    }
  }
  async updateMedicine(
    adminId: string,
    clinicId: string,
    medicalId: string,
    medicineId: string,
    medicineData: any
  ) {

    this.spinnerService.setSpinner(true);

    try {

      const ref = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('medicallist')
        .doc(medicalId)
        .collection('medicinelist')
        .doc(medicineId);

      await ref.update(medicineData);

      this.snackBar.open('Medicine updated successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

    } catch (error: any) {

      this.snackBar.open(
        `Error updating Medicine: ${error.message}`,
        'Close',
        {
          duration: 3000,
        }
      );

      throw error;

    } finally {

      this.spinnerService.setSpinner(false);

    }
  }

  async deleteMedicine(
    adminId: string,
    clinicId: string,
    medicalId: string,
    medicineId: string
  ) {

    this.spinnerService.setSpinner(true);

    try {

      const ref = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('medicallist')
        .doc(medicalId)
        .collection('medicinelist')
        .doc(medicineId);

      await ref.delete();

      this.snackBar.open('Medicine deleted successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

    } catch (error: any) {

      this.snackBar.open(
        `Error deleting Medicine: ${error.message}`,
        'Close',
        {
          duration: 3000,
        }
      );

      throw error;

    } finally {

      this.spinnerService.setSpinner(false);

    }
  }

  async getMedicine(
    adminId: string,
    clinicId: string,
    medicalId: string,
    collectionName: string
  ) {

    this.spinnerService.setSpinner(true);

    try {

      const snapshot = await this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('medicallist')
        .doc(medicalId)
        .collection(collectionName)
        .get()
        .toPromise();

      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));

    } finally {
      this.spinnerService.setSpinner(false);
    }
  }

  // new purchase
  async addpurchase(adminId: string, clinicId: string, MedicineId: string, purchaseData: any) {
    this.spinnerService.setSpinner(true);

    try {
      const medicine = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('medicallist')
        .doc(MedicineId)
        .collection('purchaselist');
      const newpurchaselistRef = medicine.ref.doc();

      const data = {
        ...purchaseData,
        id: newpurchaselistRef.id
      };
      await newpurchaselistRef.set(data);

      this.snackBar.open('Purchase added successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return newpurchaselistRef.id;

    } catch (error: any) {

      console.error(error);

      this.snackBar.open(`Error: ${error.message}`, 'Close');

      return null;

    } finally {

      this.spinnerService.setSpinner(false);
    }
  }
  async updatepurchase(
    adminId: string,
    clinicId: string,
    medicalId: string,
    purchaseId: string,
    purchaseData: any
  ) {

    this.spinnerService.setSpinner(true);

    try {

      const ref = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('medicallist')
        .doc(medicalId)
        .collection('purchaselist')
        .doc(purchaseId);

      await ref.update(purchaseData);

      this.snackBar.open('Purchase updated successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

    } catch (error: any) {

      this.snackBar.open(
        `Error updating Purchase: ${error.message}`,
        'Close',
        {
          duration: 3000,
        }
      );

      throw error;

    } finally {

      this.spinnerService.setSpinner(false);

    }
  }

  async deletepurchase(
    adminId: string,
    clinicId: string,
    medicalId: string,
    purchaseId: string
  ) {

    this.spinnerService.setSpinner(true);

    try {

      const ref = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('medicallist')
        .doc(medicalId)
        .collection('purchaselist')
        .doc(purchaseId);

      await ref.delete();

      this.snackBar.open('Purchase deleted successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

    } catch (error: any) {

      this.snackBar.open(
        `Error deleting purchase: ${error.message}`,
        'Close',
        {
          duration: 3000,
        }
      );

      throw error;

    } finally {

      this.spinnerService.setSpinner(false);

    }
  }

  async getpurchase(
    adminId: string,
    clinicId: string,
    medicalId: string,
    collectionName: string
  ) {

    this.spinnerService.setSpinner(true);

    try {

      const snapshot = await this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('medicallist')
        .doc(medicalId)
        .collection(collectionName)
        .get()
        .toPromise();

      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));

    } finally {
      this.spinnerService.setSpinner(false);
    }
  }

  // new Stock
  async addStock(adminId: string, clinicId: string, MedicineId: string, StockData: any) {
    this.spinnerService.setSpinner(true);

    try {
      const medicine = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('medicallist')
        .doc(MedicineId)
        .collection('Stocklist');
      const newStocklistRef = medicine.ref.doc();

      const data = {
        ...StockData,
        id: newStocklistRef.id
      };
      await newStocklistRef.set(data);

      this.snackBar.open('Stock added successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return newStocklistRef.id;

    } catch (error: any) {

      console.error(error);

      this.snackBar.open(`Error: ${error.message}`, 'Close');

      return null;

    } finally {

      this.spinnerService.setSpinner(false);
    }
  }
  async updateStock(
    adminId: string,
    clinicId: string,
    medicalId: string,
    StockId: string,
    StockData: any
  ) {

    this.spinnerService.setSpinner(true);

    try {

      const ref = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('medicallist')
        .doc(medicalId)
        .collection('Stocklist')
        .doc(StockId);

      await ref.update(StockData);

      this.snackBar.open('Stock updated successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

    } catch (error: any) {

      this.snackBar.open(
        `Error updating Stock: ${error.message}`,
        'Close',
        {
          duration: 3000,
        }
      );

      throw error;

    } finally {

      this.spinnerService.setSpinner(false);

    }
  }

  async deleteStock(
    adminId: string,
    clinicId: string,
    medicalId: string,
    StockId: string
  ) {

    this.spinnerService.setSpinner(true);

    try {

      const ref = this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('medicallist')
        .doc(medicalId)
        .collection('Stocklist')
        .doc(StockId);

      await ref.delete();

      this.snackBar.open('Stock deleted successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

    } catch (error: any) {

      this.snackBar.open(
        `Error deleting Stock: ${error.message}`,
        'Close',
        {
          duration: 3000,
        }
      );

      throw error;

    } finally {

      this.spinnerService.setSpinner(false);

    }
  }

  async getStock(
    adminId: string,
    clinicId: string,
    medicalId: string,
    collectionName: string
  ) {

    this.spinnerService.setSpinner(true);

    try {

      const snapshot = await this.firestore
        .collection('Admin')
        .doc(adminId)
        .collection('clinicList')
        .doc(clinicId)
        .collection('medicallist')
        .doc(medicalId)
        .collection(collectionName)
        .get()
        .toPromise();

      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));

    } finally {
      this.spinnerService.setSpinner(false);
    }
  }
}
