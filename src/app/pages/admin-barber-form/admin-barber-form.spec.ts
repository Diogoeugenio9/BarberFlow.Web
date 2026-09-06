import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBarberForm } from './admin-barber-form';

describe('AdminBarberForm', () => {
  let component: AdminBarberForm;
  let fixture: ComponentFixture<AdminBarberForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBarberForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminBarberForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
