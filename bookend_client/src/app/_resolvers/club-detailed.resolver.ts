import { ResolveFn } from '@angular/router';
import { ClubService } from '../_services/club.service';
import { inject } from '@angular/core';

export const clubDetailedResolver: ResolveFn<boolean> = (route, state) => {
  const clubService = inject(ClubService)

  return clubService.getBookClub(parseInt(route.paramMap.get('clubId')!))
};
