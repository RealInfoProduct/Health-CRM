import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseDialogComponent } from './purchase-dialog.component';

describe('PurchaseDialogComponent', () => {
  let component: PurchaseDialogComponent;
  let fixture: ComponentFixture<PurchaseDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseDialogComponent]
    });
    fixture = TestBed.createComponent(PurchaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
