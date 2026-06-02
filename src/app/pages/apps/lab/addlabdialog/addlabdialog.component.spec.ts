import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddlabdialogComponent } from './addlabdialog.component';

describe('AddlabdialogComponent', () => {
  let component: AddlabdialogComponent;
  let fixture: ComponentFixture<AddlabdialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddlabdialogComponent]
    });
    fixture = TestBed.createComponent(AddlabdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
