import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Timestamp } from 'firebase/firestore';
import { map, startWith } from 'rxjs';
import { FirebaseCollectionService } from 'src/app/services/firebase-collection.service';

@Component({
  selector: 'app-purchase-dialog',
  templateUrl: './purchase-dialog.component.html',
  styleUrls: ['./purchase-dialog.component.scss']
})
export class PurchaseDialogComponent implements OnInit {
  purchaseForm: FormGroup;
  action: string;
  local_data: any;

  medicineTypeList = [
    { id: 1, name: 'Tablet' },
    { id: 2, name: 'Capsule' },
    { id: 3, name: 'Syrup' },
    { id: 4, name: 'Injectable' },
    { id: 5, name: 'Cream' },
    { id: 6, name: 'Ointment' },
    { id: 7, name: 'Drops' },
    { id: 8, name: 'Powder' },
    { id: 9, name: 'Inhaler' },
    { id: 10, name: 'Gel' },
  ]

  unitList: string[] = [];

  filteredUnits: string[] = [];
  filteredCompanies: string[] = [];
  purchaseList: string[] = [];

  medicineList: string[] = [];
  filteredMedicines: string[] = [];
  filteredCompany:string[] =[]
  companyList:string[] =[]

  userId = localStorage.getItem('userId')
  clinicId = localStorage.getItem('clinicId')
  medicalId = localStorage.getItem('MedicalId')

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PurchaseDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private firebaseCollectionService: FirebaseCollectionService
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.addmedicallist();
    this.getPurchaseData();


    this.filteredCompanies = this.purchaseList;

    this.purchaseForm.get('supplierName')?.valueChanges.pipe(startWith(''),
    map(value => this._filterCompany(value || ''))
  )
  .subscribe(res => {
    this.filteredCompanies = res;
  });
  

    if (this.action === 'Update') {

      this.purchaseForm.patchValue({
        purchaseDate: this.convertTimestamp(this.local_data.purchaseDate),
        supplierName: this.local_data.supplierName,
        mobileNumber: this.local_data.mobileNumber,
      });

      this.getmedicine().clear();

      if (this.local_data.medicine?.length) {

        this.local_data.medicine.forEach((report: any) => {

          this.getmedicine().push(
            this.fb.group({
              medicineName: [report?.medicineName || ''],
              companyName: [report?.companyName || ''],
              medicineType: [report?.medicineType || ''],
              qty: [report?.qty || ''],
              unit: [report?.unit || ''],
              price: [report?.price || ''],
            })
          );
        });
      }
    }
  }

  convertTimestamp(element: any): Date | null {
    if (element instanceof Timestamp) {
      return element.toDate();
    }
    return null;
  }

  private _filterCompany(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.purchaseList.filter(company =>
      company.toLowerCase().includes(filterValue)
    );
  }

  getPurchaseData() {

    this.firebaseCollectionService
      .getpurchase(this.userId, this.clinicId, this.medicalId, 'purchaselist')
      .then((purchase: any[]) => {

        if (purchase && purchase.length > 0) {

          // Company List
          this.purchaseList = [...new Set(
            purchase.map(item => item.supplierName)
          )];

            // Medicine List
        this.medicineList = [...new Set(
          purchase.flatMap(item =>
            item.medicine?.map((m: any) => m.medicineName) || []
          )
        )];

        // Unit List
        this.unitList = [...new Set(
          purchase.flatMap(item =>
            item.medicine?.map((m: any) => m.unit) || []
          )
        )];

        // company List
        this.companyList = [...new Set(
          purchase.flatMap(item =>
            item.medicine?.map((m: any) => m.companyName) || []
          )
        )];


          this.filteredCompanies = this.purchaseList;

        this.setupMedicineAutocomplete();
        }
      });
  }
  
  setupMedicineAutocomplete() {

  this.getmedicine().controls.forEach((group: any, index: number) => {

    // Medicine Autocomplete
    group.get('medicineName')?.valueChanges
      .pipe(
        startWith(''),
        map((value: string) => this._filterMedicine(value || ''))
      )
      .subscribe(res => {
        this.filteredMedicines[index] = res;
      });

    // Unit Autocomplete
    group.get('unit')?.valueChanges
      .pipe(
        startWith(''),
        map((value: string) => this._filterUnit(value || ''))
      )
      .subscribe(res => {
        this.filteredUnits[index] = res;
      });

    // company Autocomplete
    group.get('companyName')?.valueChanges
      .pipe(
        startWith(''),
        map((value: string) => this._filtercompany(value || ''))
      )
      .subscribe(res => {
        this.filteredCompany[index] = res;
      });

  });
}

private _filterMedicine(value: string): string[] {
  const filterValue = value.toLowerCase();

  return this.medicineList.filter(medicine =>
    medicine.toLowerCase().includes(filterValue)
  );
}

private _filterUnit(value: string): string[] {
  const filterValue = value.toLowerCase();

  return this.unitList.filter(unit =>
    unit.toLowerCase().includes(filterValue)
  );
}

private _filtercompany(value: string): string[] {
  const filterValue = value.toLowerCase();

  return this.companyList.filter(companyName =>
    companyName?.toLowerCase().includes(filterValue)
  );
}

  addmedicallist() {
    this.purchaseForm = this.fb.group({
      purchaseDate: [new Date()],
      supplierName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      medicine: this.fb.array([this.createMedicineForm()])
    })
  }

  getmedicine(): FormArray {
    return this.purchaseForm.get('medicine') as FormArray;
  }


addReportDetail() {
  this.getmedicine().push(this.createMedicineForm());

  const index = this.getmedicine().length - 1;
  const group: any = this.getmedicine().at(index);

  // Medicine
  group.get('medicineName')?.valueChanges
    .pipe(
      startWith(''),
      map((value: string) => this._filterMedicine(value || ''))
    )
    .subscribe(res => {
      this.filteredMedicines[index] = res;
    });

  // Unit
  group.get('unit')?.valueChanges
    .pipe(
      startWith(''),
      map((value: string) => this._filterUnit(value || ''))
    )
    .subscribe(res => {
      this.filteredUnits[index] = res;
    });

  // Company
  group.get('companyName')?.valueChanges
    .pipe(
      startWith(''),
      map((value: string) => this._filtercompany(value || ''))
    )
    .subscribe(res => {
      this.filteredCompany[index] = res;
    });
}

  removeReport(index: number) {
    this.getmedicine().removeAt(index);
  }

createMedicineForm(): FormGroup {
   return this.fb.group({
    medicineName: ['', Validators.required],
    companyName: ['', Validators.required],
    medicineType: ['', Validators.required],
    qty: ['', Validators.required],
    unit: ['', Validators.required],
    price: ['', Validators.required],
  });

}



  doAction(): void {
    const payload = {
      id: this.local_data.id ? this.local_data.id : '',
      purchaseDate: this.purchaseForm.value.purchaseDate,
      supplierName: this.purchaseForm.value.supplierName,
      mobileNumber: this.purchaseForm.value.mobileNumber,
      medicine: this.purchaseForm.value.medicine,
      userId: localStorage.getItem("userId"),
      clinicId: localStorage.getItem("clinicId"),
      MedicalId: localStorage.getItem("MedicalId")
    }
    this.dialogRef.close({ event: this.action, data: payload });
  }


}