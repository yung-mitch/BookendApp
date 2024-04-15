import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { clubDetailedResolver } from './club-detailed.resolver';

describe('clubDetailedResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => clubDetailedResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
