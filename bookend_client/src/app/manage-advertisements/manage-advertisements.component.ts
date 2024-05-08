import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-manage-advertisements',
  templateUrl: './manage-advertisements.component.html',
  styleUrls: ['./manage-advertisements.component.css']
})
export class ManageAdvertisementsComponent implements OnInit{
  member: Member | undefined;
  user: User | null = null;
  advertisements: Advertisement[] = [];
  pagination: Pagination | undefined;
  adParams: AdvertisementParams | undefined;
  bsModalRefCreateAd: BsModalRef<CreateAdvertisementModalComponent> = new BsModalRef<CreateAdvertisementModalComponent>();
  bsModalRefAdEdit: BsModalRef<AdvertisementEditModalComponent> = new BsModalRef<AdvertisementEditModalComponent>();
  bsModalRefAdFileReplace: BsModalRef<AdvertisementReplaceFileModalComponent> = new BsModalRef<AdvertisementReplaceFileModalComponent>();

  constructor(private accountService: AccountService, private memberService: MemberService,
    private advertisementService: AdvertisementService, private modalService: BsModalService,
    private toastr: ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        this.user = user;
        this.adParams = new AdvertisementParams();
      }
    })
  }

  ngOnInit(): void {
    this.loadMember();
    this.loadAds();
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
          this.pagination = response.pagination;
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

  delete(advertisementId: number) {
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

  pageChanged(event: any) {
    if (this.adParams && this.adParams?.pageNumber !== event.page) {
      this.adParams.pageNumber = event.page;
      this.loadAds();
    }
  }
}