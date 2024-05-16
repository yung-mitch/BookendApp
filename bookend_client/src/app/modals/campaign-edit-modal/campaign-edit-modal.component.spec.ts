import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignEditModalComponent } from './campaign-edit-modal.component';

describe('CampaignEditModalComponent', () => {
  let component: CampaignEditModalComponent;
  let fixture: ComponentFixture<CampaignEditModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CampaignEditModalComponent]
    });
    fixture = TestBed.createComponent(CampaignEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
