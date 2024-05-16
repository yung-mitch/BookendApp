import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Advertisement } from '../_models/advertisement';
import { Member } from '../_models/member';
import { User } from '../_models/user';
import { CreateAdvertisementModalComponent } from '../modals/create-advertisement-modal/create-advertisement-modal.component';
import { AdvertisementEditModalComponent } from '../modals/advertisement-edit-modal/advertisement-edit-modal.component';
import { AdvertisementReplaceFileModalComponent } from '../modals/advertisement-replace-file-modal/advertisement-replace-file-modal.component';
import { AdvertisementService } from '../_services/advertisement.service';
import { MemberService } from '../_services/member.service';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AdvertisementParams } from '../_models/advertisementParams';
import { Pagination } from '../_models/pagination';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { ActivatedRoute } from '@angular/router';
import { CampaignParams } from '../_models/campaignParams';
import { Campaign } from '../_models/campaign';
import { CampaignEditModalComponent } from '../modals/campaign-edit-modal/campaign-edit-modal.component';
import { CreateCampaignModalComponent } from '../modals/create-campaign-modal/create-campaign-modal.component';

@Component({
  selector: 'app-manage-advertisements',
  templateUrl: './manage-advertisements.component.html',
  styleUrls: ['./manage-advertisements.component.css']
})
export class ManageAdvertisementsComponent implements OnInit{
  member: Member | undefined;
  user: User | null = null;
  advertisements: Advertisement[] = [];
  adPagination: Pagination | undefined;
  adParams: AdvertisementParams | undefined;
  campaigns: Campaign[] = [];
  campaignPagination: Pagination | undefined;
  campaignParams: CampaignParams | undefined;
  @ViewChild('advertisementTabs', {static: true}) advertisementTabs?: TabsetComponent;
  activeTab?: TabDirective;
  bsModalRefCreateAd: BsModalRef<CreateAdvertisementModalComponent> = new BsModalRef<CreateAdvertisementModalComponent>();
  bsModalRefAdEdit: BsModalRef<AdvertisementEditModalComponent> = new BsModalRef<AdvertisementEditModalComponent>();
  bsModalRefAdFileReplace: BsModalRef<AdvertisementReplaceFileModalComponent> = new BsModalRef<AdvertisementReplaceFileModalComponent>();
  bsModalRefCreateCampaign: BsModalRef<CreateCampaignModalComponent> = new BsModalRef<CreateCampaignModalComponent>();
  bsModalRefCampaignEdit: BsModalRef<CampaignEditModalComponent> = new BsModalRef<CampaignEditModalComponent>();

  constructor(private accountService: AccountService, private memberService: MemberService,
    private advertisementService: AdvertisementService, private modalService: BsModalService,
    private toastr: ToastrService, private route: ActivatedRoute) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        this.user = user;
        this.adParams = new AdvertisementParams();
        this.campaignParams = new CampaignParams();
      }
    })
  }

  ngOnInit(): void {
    this.loadMember();
    this.loadAds();
    this.loadCampaigns();

    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab'])
      }
    })
  }

  loadMember() {
    if (!this.user) return;
    this.memberService.getMember(this.user.userName).subscribe({
      next: member => this.member = member
    })
  }

  loadAds() {
    if (!this.user || !this.adParams) return;
    this.advertisementService.getPublishedAdvertisements(this.adParams).subscribe({
      next: response => {
        if (response.result && response.pagination)
        {
          this.advertisements = response.result;
          this.adPagination = response.pagination;
        }
      }
    })
  }

  loadCampaigns() {
    if (!this.user || !this.campaignParams) return;
    this.advertisementService.getPublishedCampaigns(this.campaignParams).subscribe({
      next: response => {
        if (response.result && response.pagination)
          {
            this.campaigns = response.result;
            this.campaignPagination = response.pagination;
          }
      }
    })
  }

  openCreateAdvertisementModal() {
    const config = {
      class: 'modal-dialog-centered'
    }
    this.bsModalRefCreateAd = this.modalService.show(CreateAdvertisementModalComponent, config);
    this.bsModalRefCreateAd.onHide?.subscribe({
      next: () => {
        const newAdvertisement = this.bsModalRefCreateAd.content?.advertisement;
        if (newAdvertisement) {
          this.advertisements.push(newAdvertisement);
          this.toastr.success('Success! New Advertisement created');
        }
        console.log(newAdvertisement);

      }
    })
  }

  openAdvertisementEditModal(ad: Advertisement) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        adName: ad.adName
      }
    }
    this.bsModalRefAdEdit = this.modalService.show(AdvertisementEditModalComponent, config);
    this.bsModalRefAdEdit.onHide?.subscribe({
      next: () => {
        const adUpdate = {
          adName: this.bsModalRefAdEdit.content?.model.adName
        }
        if (adUpdate.adName != "") {
          this.advertisementService.updateAdvertisement(adUpdate, ad.id).subscribe({
            next: () => {
              this.advertisements[this.advertisements.indexOf(ad)].adName = adUpdate.adName;
              this.toastr.success('Success! Changes saved to your Advertisement');
            }
          })
        }
      }
    })
  }

  openAdvertisementReplaceFileModal(ad: Advertisement) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        advertisementId: ad.id
      }
    }
    this.bsModalRefAdFileReplace = this.modalService.show(AdvertisementReplaceFileModalComponent, config);
    this.bsModalRefAdFileReplace.onHide?.subscribe({
      next: () => {
        this.toastr.success('Success! You replaced the Advertisement audio file.');
      }
    })
  }

  deleteAd(advertisementId: number) {
    this.advertisementService.deleteAdvertisement(advertisementId).subscribe({
      next: () => {
        this.advertisements = this.advertisements.filter(x => x.id != advertisementId);
        this.toastr.success('Success! Advertisement has been deleted');
      },
      error: error => {
        console.log(error);
        this.toastr.error('Something went wrong when attempting to delete the Advertisement\n\n' + error);
      }
    })
  }

  pageChangedAds(event: any) {
    if (this.adParams && this.adParams?.pageNumber !== event.page) {
      this.adParams.pageNumber = event.page;
      this.loadAds();
    }
  }

  pageChangedCampaigns(event: any) {
    if (this.campaignParams && this.campaignParams?.pageNumber !== event.page) {
      this.campaignParams.pageNumber = event.page;
      this.loadCampaigns();
    }
  }

  selectTab(heading: string) {
    if (this.advertisementTabs) {
      this.advertisementTabs.tabs.find(x => x.heading === heading)!.active = true;
    }
  }

  openCreateCampaignModal() {
    const config = {
      class: 'modal-dialog-centered'
    }
    this.bsModalRefCreateCampaign = this.modalService.show(CreateCampaignModalComponent, config);
    this.bsModalRefCreateCampaign.onHide?.subscribe({
      next: () => {
        var newCampaign = {
          title: this.bsModalRefCreateCampaign.content?.title,
          active: false,
          budget: this.bsModalRefCreateCampaign.content?.budget,
          targetMinAge: this.bsModalRefCreateCampaign.content?.targetMinAge,
          targetMaxAge: this.bsModalRefCreateCampaign.content?.targetMaxAge,
          targetEthnicities: this.bsModalRefCreateCampaign.content?.targetEthnicities,
          targetGenreInterests: this.bsModalRefCreateCampaign.content?.targetGenreInterests,
          advertisementId: this.bsModalRefCreateCampaign.content?.advertisementId
        }
        if (newCampaign.title && newCampaign.advertisementId) {
          newCampaign = this.setDefaults(newCampaign);
          console.log(newCampaign);
          this.advertisementService.createCampaign(newCampaign).subscribe({
            next: response => {
              if (response) {
                if (this.campaignParams) {
                  this.campaignParams.pageNumber = 1;
                  this.loadCampaigns();
                  this.toastr.success('Success! New Campaign created');
                }
              }
            }
          })
        }
      }
    })
  }

  openCampaignEditModal(campaign: Campaign) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        title: campaign.title,
        staticTitle: campaign.title,
        active: campaign.active,
        budget: campaign.budget,
        targetMinAge: campaign.targetMinAge,
        targetMaxAge: campaign.targetMaxAge,
        targetEthnicities: campaign.targetEthnicities,
        targetGenreInterests: campaign.targetGenreInterests,
        advertisementId: campaign.advertisement.id
      }
    }
    this.bsModalRefCampaignEdit = this.modalService.show(CampaignEditModalComponent, config);
    this.bsModalRefCampaignEdit.onHide?.subscribe({
      next: () => {
        console.log('onhide');
        if (this.bsModalRefCampaignEdit.content?.saveSelected) {
          console.log('save selected');
          const campaignUpdate = {
            title: this.bsModalRefCampaignEdit.content?.title,
            active: this.bsModalRefCampaignEdit.content?.active,
            budget: this.bsModalRefCampaignEdit.content?.budget,
            targetMinAge: this.bsModalRefCampaignEdit.content?.targetMinAge,
            targetMaxAge: this.bsModalRefCampaignEdit.content?.targetMaxAge,
            targetEthnicities: this.bsModalRefCampaignEdit.content?.targetEthnicities,
            targetGenreInterests: this.bsModalRefCampaignEdit.content?.targetGenreInterests,
            advertisementId: this.bsModalRefCampaignEdit.content?.advertisementId
          }
  
          if (campaign.title != campaignUpdate.title || campaign.active != campaignUpdate.active ||
            campaign.budget != campaignUpdate.budget || campaign.targetMinAge != campaignUpdate.targetMinAge ||
            campaign.targetMaxAge != campaignUpdate.targetMaxAge || JSON.stringify(campaign.targetEthnicities) != JSON.stringify(campaignUpdate.targetEthnicities) ||
            JSON.stringify(campaign.targetGenreInterests) != JSON.stringify(campaignUpdate.targetGenreInterests) || campaign.advertisement.id != campaignUpdate.advertisementId) {
            this.advertisementService.updateCampaign(campaignUpdate, campaign.id).subscribe({
              next: () => {
                this.loadCampaigns();
                this.toastr.success('Success! Changes saved to Campaign');
              },
              error: error => {
                this.toastr.error('Something went wrong when attempting to make changes to the campaign\n\n' + error);
              }
            })
          }
        }
      }
    })
  }

  deleteCampaign(campaignId: number) {
    this.advertisementService.deleteCampaign(campaignId).subscribe({
      next: () => {
        this.loadCampaigns();
        this.toastr.success('Success! Campaign deleted');
      },
      error: error => {
        console.log(error);
        this.toastr.error('Something went wrong when attempting to delete the Campaign\n\n' + error);
      }
    })
  }

  formatList(attributeList: string[]) {
    var attributeStr = '';
    for (let i = 0; i < attributeList.length - 1; i++) {
      attributeStr += attributeList[i] + ', ';
    }
    attributeStr += attributeList[attributeList.length - 1];
    // console.log(attributeStr);

    return attributeStr;
  }

  setDefaults(campaign: any) {
    if (campaign.budget == undefined) campaign.budget = 0;
    if (campaign.targetMinAge == undefined || campaign.targetMinAge < 18) campaign.targetMinAge = 18;
    if (campaign.targetMaxAge == undefined || campaign.targetMaxAge > 100) campaign.targetMaxAge = 100;

    return campaign;
  }
}