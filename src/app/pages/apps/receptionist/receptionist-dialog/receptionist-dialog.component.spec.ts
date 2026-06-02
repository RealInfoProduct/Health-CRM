import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionistDialogComponent } from './receptionist-dialog.component';

describe('ReceptionistDialogComponent', () => {
  let component: ReceptionistDialogComponent;
  let fixture: ComponentFixture<ReceptionistDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceptionistDialogComponent]
    });
    fixture = TestBed.createComponent(ReceptionistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
