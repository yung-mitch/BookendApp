import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBookClubModalComponent } from './create-book-club-modal.component';

describe('CreateBookClubModalComponent', () => {
  let component: CreateBookClubModalComponent;
  let fixture: ComponentFixture<CreateBookClubModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateBookClubModalComponent]
    });
    fixture = TestBed.createComponent(CreateBookClubModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
