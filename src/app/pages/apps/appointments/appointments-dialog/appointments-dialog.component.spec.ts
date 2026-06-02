import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsDialogComponent } from './appointments-dialog.component';

describe('AppointmentsDialogComponent', () => {
  let component: AppointmentsDialogComponent;
  let fixture: ComponentFixture<AppointmentsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentsDialogComponent]
    });
    fixture = TestBed.createComponent(AppointmentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
