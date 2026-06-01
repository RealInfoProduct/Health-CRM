import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmitPatientComponent } from './admit-patient.component';

describe('AdmitPatientComponent', () => {
  let component: AdmitPatientComponent;
  let fixture: ComponentFixture<AdmitPatientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdmitPatientComponent]
    });
    fixture = TestBed.createComponent(AdmitPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
