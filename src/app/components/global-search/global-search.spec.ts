import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSearch } from './global-search';

describe('GlobalSearch', () => {
  let component: GlobalSearch;
  let fixture: ComponentFixture<GlobalSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
