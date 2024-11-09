import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbilldialogComponent } from './addbilldialog.component';

describe('AddbilldialogComponent', () => {
  let component: AddbilldialogComponent;
  let fixture: ComponentFixture<AddbilldialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddbilldialogComponent]
    });
    fixture = TestBed.createComponent(AddbilldialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
