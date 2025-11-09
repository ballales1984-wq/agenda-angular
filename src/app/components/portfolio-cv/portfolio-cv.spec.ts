import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioCv } from './portfolio-cv';

describe('PortfolioCv', () => {
  let component: PortfolioCv;
  let fixture: ComponentFixture<PortfolioCv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioCv]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioCv);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
