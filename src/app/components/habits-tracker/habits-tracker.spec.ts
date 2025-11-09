import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitsTracker } from './habits-tracker';

describe('HabitsTracker', () => {
  let component: HabitsTracker;
  let fixture: ComponentFixture<HabitsTracker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitsTracker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitsTracker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
