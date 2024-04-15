import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBookClubBookModalComponent } from './add-book-club-book-modal.component';

describe('AddBookClubBookModalComponent', () => {
  let component: AddBookClubBookModalComponent;
  let fixture: ComponentFixture<AddBookClubBookModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBookClubBookModalComponent]
    });
    fixture = TestBed.createComponent(AddBookClubBookModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
