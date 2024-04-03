import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Advertisement } from '../_models/advertisement';
import { User } from '../_models/user';
import { HttpClient } from '@angular/common/http';
import { AccountService } from './account.service';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdvertisementService {
  baseUrl = environment.apiUrl;
  advertisements: Advertisement[] = [];
  user: User | undefined;

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.user = user;
        }
      }
    })
  }

  getAdvertisements() {

  }

  getAdvertisementsToServe() {
    return this.http.get<Advertisement[]>(this.baseUrl + 'advertisements/advertisements-to-serve');
  }

  getPublishedAdvertisements() {
    return this.http.get<Advertisement[]>(this.baseUrl + 'advertisements/published');
  }
  
  updateAdvertisement(advertisement: any, advertisementId: number) {
    return this.http.put(this.baseUrl + 'advertisements/update-advertisement/' + advertisementId, advertisement);
  }

  deleteAdvertisement(advertisementId: number) {
    return this.http.delete(this.baseUrl + 'advertisements/delete-advertisement/' + advertisementId);
  }
}
