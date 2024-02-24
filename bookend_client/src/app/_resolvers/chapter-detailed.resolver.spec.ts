import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { chapterDetailedResolver } from './chapter-detailed.resolver';

describe('chapterDetailedResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => chapterDetailedResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
