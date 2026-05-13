import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareScenarios } from './compare-scenarios';

describe('CompareScenarios', () => {
  let component: CompareScenarios;
  let fixture: ComponentFixture<CompareScenarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompareScenarios],
    }).compileComponents();

    fixture = TestBed.createComponent(CompareScenarios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
