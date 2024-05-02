import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

declare function toggleHamburger(): any;
declare function removeHamburger(): any;
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  // bookendScript: any;
  @Output() mobileMenuToggleEvent = new EventEmitter<number>();
  @Output() mobileMenuCloseEvent = new EventEmitter<number>();
  
  constructor(public accountService: AccountService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: response => {
        console.log(response)
        this.accountService.currentUser$.pipe(take(1)).subscribe({
          next: user => {
            if (user?.roles.includes("AppMember")) {
              this.router.navigateByUrl('/library');
            } else if (user?.roles.includes("Publisher")){
              this.router.navigateByUrl('/books/manage');
            } else if (user?.roles.includes("Advertiser")) {
              this.router.navigateByUrl('/advertisements/manage');
            } else {
              this.router.navigateByUrl('/');
            }
            
            this.toastr.success('Welcome back, ' + user?.userName)
          }
        })
        this.model = {};
      },
      complete: () => {
        this.removeMobileMenu();
      }
    })
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

  // loadScripts() {
  //   let node = document.createElement('script');
  //   node.src = '../../assets/bookend-script.js';
  //   node.type = 'text/javascript';
  //   node.async = true;
  //   document.getElementsByTagName('body')[0].appendChild(node);
  // }

  toggleMobileMenu() {
    toggleHamburger();
    this.mobileMenuToggleEvent.emit(1);
  }

  removeMobileMenu() {
    removeHamburger();
    this.mobileMenuCloseEvent.emit(1);
  }
}
