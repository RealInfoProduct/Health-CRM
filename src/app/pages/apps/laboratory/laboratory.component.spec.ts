import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryComponent } from './laboratory.component';

describe('LaboratoryComponent', () => {
  let component: LaboratoryComponent;
  let fixture: ComponentFixture<LaboratoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LaboratoryComponent]
    });
    fixture = TestBed.createComponent(LaboratoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
