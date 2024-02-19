import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterReplaceFileModalComponent } from './chapter-replace-file-modal.component';

describe('ChapterReplaceFileModalComponent', () => {
  let component: ChapterReplaceFileModalComponent;
  let fixture: ComponentFixture<ChapterReplaceFileModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChapterReplaceFileModalComponent]
    });
    fixture = TestBed.createComponent(ChapterReplaceFileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
