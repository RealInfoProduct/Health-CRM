import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClicnkComponent } from './clicnk.component';

describe('ClicnkComponent', () => {
  let component: ClicnkComponent;
  let fixture: ComponentFixture<ClicnkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClicnkComponent]
    });
    fixture = TestBed.createComponent(ClicnkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
