import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObiettiviManager } from './obiettivi-manager';

describe('ObiettiviManager', () => {
  let component: ObiettiviManager;
  let fixture: ComponentFixture<ObiettiviManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObiettiviManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObiettiviManager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
