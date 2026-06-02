import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyRoutineComponent } from './daily-routine.component';

describe('DailyRoutineComponent', () => {
  let component: DailyRoutineComponent;
  let fixture: ComponentFixture<DailyRoutineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyRoutineComponent]
    });
    fixture = TestBed.createComponent(DailyRoutineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
