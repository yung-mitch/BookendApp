import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoEditorModalComponent } from './photo-editor-modal.component';

describe('PhotoEditorModalComponent', () => {
  let component: PhotoEditorModalComponent;
  let fixture: ComponentFixture<PhotoEditorModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoEditorModalComponent]
    });
    fixture = TestBed.createComponent(PhotoEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
