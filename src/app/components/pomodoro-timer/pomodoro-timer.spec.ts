import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PomodoroTimer } from './pomodoro-timer';

describe('PomodoroTimer', () => {
  let component: PomodoroTimer;
  let fixture: ComponentFixture<PomodoroTimer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PomodoroTimer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PomodoroTimer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
