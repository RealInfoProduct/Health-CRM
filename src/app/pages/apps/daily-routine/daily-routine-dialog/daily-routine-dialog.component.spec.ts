import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyRoutineDialogComponent } from './daily-routine-dialog.component';

describe('DailyRoutineDialogComponent', () => {
  let component: DailyRoutineDialogComponent;
  let fixture: ComponentFixture<DailyRoutineDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyRoutineDialogComponent]
    });
    fixture = TestBed.createComponent(DailyRoutineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
