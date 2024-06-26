/*
  Member Service

  The Member Service handles the functions related to AppUsers once they are logged into the application.

  PLEASE NOTE: There is a separate service titled `Account Service` that handles AppUser functions for
  accessing the application.
*/

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { AccountService } from './account.service';
import { of, take } from 'rxjs';
import { Member } from '../_models/member';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { UserParams } from '../_models/userParams';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
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

  getMembers(userParams: UserParams) {
    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('searchString', userParams.searchString);

    return getPaginatedResult<Member[]>(this.baseUrl + 'users', params, this.http);
  }

  getMember(userName: string) {
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.userName == userName);

      if (member) return of(member);
      
      return this.http.get<Member>(this.baseUrl + 'users/' + userName);
  }
}
