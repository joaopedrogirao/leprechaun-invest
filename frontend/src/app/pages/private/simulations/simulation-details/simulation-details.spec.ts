import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationDetails } from './simulation-details';

describe('SimulationDetails', () => {
  let component: SimulationDetails;
  let fixture: ComponentFixture<SimulationDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulationDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(SimulationDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
