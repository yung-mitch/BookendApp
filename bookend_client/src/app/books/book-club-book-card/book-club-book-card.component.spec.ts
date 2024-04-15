import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookClubBookCardComponent } from './book-club-book-card.component';

describe('BookClubBookCardComponent', () => {
  let component: BookClubBookCardComponent;
  let fixture: ComponentFixture<BookClubBookCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookClubBookCardComponent]
    });
    fixture = TestBed.createComponent(BookClubBookCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
