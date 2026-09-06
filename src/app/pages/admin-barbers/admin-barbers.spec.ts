import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBarbers } from './admin-barbers';

describe('AdminBarbers', () => {
  let component: AdminBarbers;
  let fixture: ComponentFixture<AdminBarbers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBarbers],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminBarbers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
