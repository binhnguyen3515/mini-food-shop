import { TestBed } from '@angular/core/testing';

import { AdminAndManagerGuard } from './admin-and-manager.guard';

describe('AdminAndManagerGuard', () => {
  let guard: AdminAndManagerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdminAndManagerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
