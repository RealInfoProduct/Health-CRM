import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddlaboratorydialogComponent } from './addlaboratorydialog.component';

describe('AddlaboratorydialogComponent', () => {
  let component: AddlaboratorydialogComponent;
  let fixture: ComponentFixture<AddlaboratorydialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddlaboratorydialogComponent]
    });
    fixture = TestBed.createComponent(AddlaboratorydialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
