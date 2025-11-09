import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsDashboard } from './stats-dashboard';

describe('StatsDashboard', () => {
  let component: StatsDashboard;
  let fixture: ComponentFixture<StatsDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
