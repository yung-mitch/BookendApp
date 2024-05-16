import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Advertisement } from 'src/app/_models/advertisement';
import { AdvertisementParams } from 'src/app/_models/advertisementParams';
import { Pagination } from 'src/app/_models/pagination';
import { AdvertisementService } from 'src/app/_services/advertisement.service';

@Component({
  selector: 'app-create-campaign-modal',
  templateUrl: './create-campaign-modal.component.html',
  styleUrls: ['./create-campaign-modal.component.css']
})
export class CreateCampaignModalComponent implements OnInit {
  title: string = '';
  budget: number | undefined;
  targetMinAge: number | undefined;
  targetMaxAge: number | undefined;
  targetEthnicities: string[] = [];
  targetGenreInterests: string[] = [];
  advertisementId: number | undefined;
  adsList: Advertisement[] = [];
  adParams: AdvertisementParams | undefined;
  pagination: Pagination | undefined;

  ethnicityStr: string = '';
  genreStr: string = '';

  constructor(public bsModalRef: BsModalRef, public adService: AdvertisementService) {
    this.adParams = new AdvertisementParams();
  }

  ngOnInit(): void {
    this.loadAds();
  }

  loadAds() {
    if (this.adParams) {
      this.adService.getPublishedAdvertisements(this.adParams).subscribe({
        next: response => {
          if (response.result && response.pagination) {
            this.adsList = response.result;
            this.pagination = response.pagination;
          }
        }
      })
    }
  }

  addTargetEthnicity() {
    if (this.ethnicityStr != '' && !this.targetEthnicities.includes(this.ethnicityStr)) {
      this.targetEthnicities.push(this.ethnicityStr);
      console.log(this.targetEthnicities);
      this.ethnicityStr = '';
    }
  }

  addTargetGenre() {
    if (this.genreStr != '' && !this.targetGenreInterests.includes(this.genreStr)) {
      this.targetGenreInterests.push(this.genreStr);
      this.genreStr = '';
    }
  }

  removeTargetEthnicity(ethnicity: string) {
    if (this.targetEthnicities.includes(ethnicity)) this.targetEthnicities = this.targetEthnicities.filter(x => x != ethnicity);
  }

  removeTargetGenre(genre: string) {
    if (this.targetGenreInterests.includes(genre)) this.targetGenreInterests = this.targetGenreInterests.filter(x => x != genre);
  }

  pageChanged(event: any) {
    if (this.adParams && this.adParams?.pageNumber !== event.page) {
      this.adParams.pageNumber = event.page;
      this.loadAds();
    }
  }
}
