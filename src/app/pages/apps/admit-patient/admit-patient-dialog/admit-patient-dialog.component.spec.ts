import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmitPatientDialogComponent } from './admit-patient-dialog.component';

describe('AdmitPatientDialogComponent', () => {
  let component: AdmitPatientDialogComponent;
  let fixture: ComponentFixture<AdmitPatientDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdmitPatientDialogComponent]
    });
    fixture = TestBed.createComponent(AdmitPatientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
