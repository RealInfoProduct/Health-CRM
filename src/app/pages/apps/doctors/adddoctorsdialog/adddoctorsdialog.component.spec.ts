import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdddoctorsdialogComponent } from './adddoctorsdialog.component';

describe('AdddoctorsdialogComponent', () => {
  let component: AdddoctorsdialogComponent;
  let fixture: ComponentFixture<AdddoctorsdialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdddoctorsdialogComponent]
    });
    fixture = TestBed.createComponent(AdddoctorsdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
