import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdvertisementModalComponent } from './create-advertisement-modal.component';

describe('CreateAdvertisementModalComponent', () => {
  let component: CreateAdvertisementModalComponent;
  let fixture: ComponentFixture<CreateAdvertisementModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateAdvertisementModalComponent]
    });
    fixture = TestBed.createComponent(CreateAdvertisementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
