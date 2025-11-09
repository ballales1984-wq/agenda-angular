import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityFeed } from './community-feed';

describe('CommunityFeed', () => {
  let component: CommunityFeed;
  let fixture: ComponentFixture<CommunityFeed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityFeed]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityFeed);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
