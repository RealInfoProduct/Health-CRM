import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalViewComponent } from './medical-view.component';

describe('MedicalViewComponent', () => {
  let component: MedicalViewComponent;
  let fixture: ComponentFixture<MedicalViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicalViewComponent]
    });
    fixture = TestBed.createComponent(MedicalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
