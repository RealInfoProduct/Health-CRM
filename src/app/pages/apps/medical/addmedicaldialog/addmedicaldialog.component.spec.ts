import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmedicaldialogComponent } from './addmedicaldialog.component';

describe('AddmedicaldialogComponent', () => {
  let component: AddmedicaldialogComponent;
  let fixture: ComponentFixture<AddmedicaldialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddmedicaldialogComponent]
    });
    fixture = TestBed.createComponent(AddmedicaldialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
