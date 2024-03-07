import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementReplaceFileModalComponent } from './advertisement-replace-file-modal.component';

describe('AdvertisementReplaceFileModalComponent', () => {
  let component: AdvertisementReplaceFileModalComponent;
  let fixture: ComponentFixture<AdvertisementReplaceFileModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdvertisementReplaceFileModalComponent]
    });
    fixture = TestBed.createComponent(AdvertisementReplaceFileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
