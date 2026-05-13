import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileQuiz } from './profile-quiz';

describe('ProfileQuiz', () => {
  let component: ProfileQuiz;
  let fixture: ComponentFixture<ProfileQuiz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileQuiz],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileQuiz);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
