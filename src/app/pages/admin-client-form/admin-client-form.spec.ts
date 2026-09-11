import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClientForm } from './admin-client-form';

describe('AdminClientForm', () => {
  let component: AdminClientForm;
  let fixture: ComponentFixture<AdminClientForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminClientForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminClientForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
