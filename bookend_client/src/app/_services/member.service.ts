/*
  Member Service

  The Member Service handles the functions related to AppUsers once they are logged into the application.

  PLEASE NOTE: There is a separate service titled `Account Service` that handles AppUser functions for
  accessing the application.
*/

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private http: HttpClient) { }
}
