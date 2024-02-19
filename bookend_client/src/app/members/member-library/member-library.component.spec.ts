import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberLibraryComponent } from './member-library.component';

describe('MemberLibraryComponent', () => {
  let component: MemberLibraryComponent;
  let fixture: ComponentFixture<MemberLibraryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MemberLibraryComponent]
    });
    fixture = TestBed.createComponent(MemberLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
