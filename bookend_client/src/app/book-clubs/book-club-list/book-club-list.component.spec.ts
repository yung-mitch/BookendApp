import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookClubListComponent } from './book-club-list.component';

describe('BookClubListComponent', () => {
  let component: BookClubListComponent;
  let fixture: ComponentFixture<BookClubListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookClubListComponent]
    });
    fixture = TestBed.createComponent(BookClubListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
