import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementEditModalComponent } from './advertisement-edit-modal.component';

describe('AdvertisementEditModalComponent', () => {
  let component: AdvertisementEditModalComponent;
  let fixture: ComponentFixture<AdvertisementEditModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdvertisementEditModalComponent]
    });
    fixture = TestBed.createComponent(AdvertisementEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
