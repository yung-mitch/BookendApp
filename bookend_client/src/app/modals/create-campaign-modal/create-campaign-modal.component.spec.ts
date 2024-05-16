import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCampaignModalComponent } from './create-campaign-modal.component';

describe('CreateCampaignModalComponent', () => {
  let component: CreateCampaignModalComponent;
  let fixture: ComponentFixture<CreateCampaignModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCampaignModalComponent]
    });
    fixture = TestBed.createComponent(CreateCampaignModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
