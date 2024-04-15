import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookClubDetailComponent } from './book-club-detail.component';

describe('BookClubDetailComponent', () => {
  let component: BookClubDetailComponent;
  let fixture: ComponentFixture<BookClubDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookClubDetailComponent]
    });
    fixture = TestBed.createComponent(BookClubDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
