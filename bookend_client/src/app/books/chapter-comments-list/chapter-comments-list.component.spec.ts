import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterCommentsListComponent } from './chapter-comments-list.component';

describe('ChapterCommentsListComponent', () => {
  let component: ChapterCommentsListComponent;
  let fixture: ComponentFixture<ChapterCommentsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChapterCommentsListComponent]
    });
    fixture = TestBed.createComponent(ChapterCommentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
