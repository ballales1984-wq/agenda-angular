import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicrophoneTest } from './microphone-test';

describe('MicrophoneTest', () => {
  let component: MicrophoneTest;
  let fixture: ComponentFixture<MicrophoneTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MicrophoneTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MicrophoneTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
