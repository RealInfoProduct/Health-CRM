import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClicnkDialogComponent } from './clicnk-dialog.component';

describe('ClicnkDialogComponent', () => {
  let component: ClicnkDialogComponent;
  let fixture: ComponentFixture<ClicnkDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClicnkDialogComponent]
    });
    fixture = TestBed.createComponent(ClicnkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
