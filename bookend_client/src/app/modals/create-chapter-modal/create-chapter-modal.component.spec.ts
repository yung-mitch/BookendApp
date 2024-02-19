import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChapterModalComponent } from './create-chapter-modal.component';

describe('CreateChapterModalComponent', () => {
  let component: CreateChapterModalComponent;
  let fixture: ComponentFixture<CreateChapterModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateChapterModalComponent]
    });
    fixture = TestBed.createComponent(CreateChapterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
