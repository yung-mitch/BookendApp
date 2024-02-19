import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBookModalComponent } from './create-book-modal.component';

describe('CreateBookModalComponent', () => {
  let component: CreateBookModalComponent;
  let fixture: ComponentFixture<CreateBookModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateBookModalComponent]
    });
    fixture = TestBed.createComponent(CreateBookModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
