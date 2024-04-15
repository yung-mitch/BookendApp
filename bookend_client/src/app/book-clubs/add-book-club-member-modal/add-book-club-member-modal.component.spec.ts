import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBookClubMemberModalComponent } from './add-book-club-member-modal.component';

describe('AddBookClubMemberModalComponent', () => {
  let component: AddBookClubMemberModalComponent;
  let fixture: ComponentFixture<AddBookClubMemberModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBookClubMemberModalComponent]
    });
    fixture = TestBed.createComponent(AddBookClubMemberModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
