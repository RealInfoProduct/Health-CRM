import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryViewComponent } from './laboratory-view.component';

describe('LaboratoryViewComponent', () => {
  let component: LaboratoryViewComponent;
  let fixture: ComponentFixture<LaboratoryViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LaboratoryViewComponent]
    });
    fixture = TestBed.createComponent(LaboratoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
