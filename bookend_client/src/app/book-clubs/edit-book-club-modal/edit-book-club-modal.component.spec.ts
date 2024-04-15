import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBookClubModalComponent } from './edit-book-club-modal.component';

describe('EditBookClubModalComponent', () => {
  let component: EditBookClubModalComponent;
  let fixture: ComponentFixture<EditBookClubModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditBookClubModalComponent]
    });
    fixture = TestBed.createComponent(EditBookClubModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
