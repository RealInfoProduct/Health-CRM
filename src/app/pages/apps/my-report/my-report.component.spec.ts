import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReportComponent } from './my-report.component';

describe('MyReportComponent', () => {
  let component: MyReportComponent;
  let fixture: ComponentFixture<MyReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyReportComponent]
    });
    fixture = TestBed.createComponent(MyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
