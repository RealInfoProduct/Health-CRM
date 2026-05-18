import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionistComponent } from './receptionist.component';

describe('ReceptionistComponent', () => {
  let component: ReceptionistComponent;
  let fixture: ComponentFixture<ReceptionistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceptionistComponent]
    });
    fixture = TestBed.createComponent(ReceptionistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
