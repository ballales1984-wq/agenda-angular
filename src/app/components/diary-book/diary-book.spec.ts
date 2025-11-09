import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiaryBook } from './diary-book';

describe('DiaryBook', () => {
  let component: DiaryBook;
  let fixture: ComponentFixture<DiaryBook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiaryBook]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiaryBook);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
