import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Bookend App';
  baseUrl = environment.apiUrl;
  users: any;
  mobileMenuOpen = false;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user: User = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }

  toggleMobileMenu(val: number) {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  collapseMobileMenu(val: number) {
    this.mobileMenuOpen = false;
  }
}
