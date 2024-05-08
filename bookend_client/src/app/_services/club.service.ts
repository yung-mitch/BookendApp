import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BookClub } from '../_models/bookClub';
import { map, of } from 'rxjs';
import { Book } from '../_models/book';
import { Member } from '../_models/member';
import { BookParams } from '../_models/bookParams';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { UserParams } from '../_models/userParams';

@Injectable({
  providedIn: 'root'
})
export class ClubService {
  baseUrl = environment.apiUrl;
  clubs: BookClub[] = [];
  clubCache = new Map();

  constructor(private http: HttpClient) { }

  getBookClubs() {
    return this.http.get<BookClub[]>(this.baseUrl + 'clubs');
  }

  getBookClub(clubId: number) {
    const club = [...this.clubCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((club: BookClub) => club.id === clubId);

      if (club) return of(club);

      return this.http.get<BookClub>(this.baseUrl + 'clubs/' + clubId);
  }

  createBookClub(bookClub: any) {
    return this.http.post(this.baseUrl + 'clubs/create-club', bookClub);
  }

  updateBookClub(club: any, clubId: number) {
    return this.http.put(this.baseUrl + 'clubs/update-club/' + clubId, club);
  }

  deleteBookClub(clubId: number) {
    return this.http.delete(this.baseUrl + 'clubs/delete-club/' + clubId);
  }

  getBookClubMembers(userParams: UserParams, clubId: number) {
    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('searchString', userParams.searchString);

    return getPaginatedResult<Member[]>(this.baseUrl + 'clubs/members/' + clubId, params, this.http);
  }

  addBookClubMember(clubId: number, newMemberId: number) {
    return this.http.post(this.baseUrl + 'clubs/add-member/' + clubId + '?newMemberId=' + newMemberId, {});
  }

  removeBookClubMember(clubId: number, userId: number) {
    return this.http.delete(this.baseUrl + 'clubs/remove-member/' + clubId + '?userId=' + userId);
  }

  getBookClubBooks(bookParams: BookParams, clubId: number) {
    let params = getPaginationHeaders(bookParams.pageNumber, bookParams.pageSize);
    params = params.append('searchString', bookParams.searchString);

    return getPaginatedResult<Book[]>(this.baseUrl + 'clubs/books/' + clubId, params, this.http);
  }

  addBookClubBook(clubId: number, bookId: number) {
    return this.http.post(this.baseUrl + 'clubs/add-book/' + clubId + '?bookId=' + bookId, {});
  }

  removeBookClubBook(clubId: number, bookId: number) {
    return this.http.delete(this.baseUrl + 'clubs/remove-book/' + clubId + '?bookId=' + bookId);
  }
}
