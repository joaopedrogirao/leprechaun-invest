import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentCard } from './investment-card';

describe('InvestmentCard', () => {
  let component: InvestmentCard;
  let fixture: ComponentFixture<InvestmentCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestmentCard],
    }).compileComponents();

    fixture = TestBed.createComponent(InvestmentCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
