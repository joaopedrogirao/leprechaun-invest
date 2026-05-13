import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialEducation } from './financial-education';

describe('FinancialEducation', () => {
  let component: FinancialEducation;
  let fixture: ComponentFixture<FinancialEducation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialEducation],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialEducation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
