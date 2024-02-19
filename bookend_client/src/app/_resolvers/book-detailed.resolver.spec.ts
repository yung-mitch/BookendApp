import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { bookDetailedResolver } from './book-detailed.resolver';

describe('bookDetailedResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => bookDetailedResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
