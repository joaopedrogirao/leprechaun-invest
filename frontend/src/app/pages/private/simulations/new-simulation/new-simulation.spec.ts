import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSimulation } from './new-simulation';

describe('NewSimulation', () => {
  let component: NewSimulation;
  let fixture: ComponentFixture<NewSimulation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSimulation],
    }).compileComponents();

    fixture = TestBed.createComponent(NewSimulation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
