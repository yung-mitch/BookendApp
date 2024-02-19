import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePublishedBooksComponent } from './manage-published-books.component';

describe('ManagePublishedBooksComponent', () => {
  let component: ManagePublishedBooksComponent;
  let fixture: ComponentFixture<ManagePublishedBooksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagePublishedBooksComponent]
    });
    fixture = TestBed.createComponent(ManagePublishedBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
