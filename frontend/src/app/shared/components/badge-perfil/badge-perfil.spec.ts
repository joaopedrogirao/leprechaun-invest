import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgePerfil } from './badge-perfil';

describe('BadgePerfil', () => {
  let component: BadgePerfil;
  let fixture: ComponentFixture<BadgePerfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgePerfil],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgePerfil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
