import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAdvertisementsComponent } from './manage-advertisements.component';

describe('ManageAdvertisementsComponent', () => {
  let component: ManageAdvertisementsComponent;
  let fixture: ComponentFixture<ManageAdvertisementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageAdvertisementsComponent]
    });
    fixture = TestBed.createComponent(ManageAdvertisementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
