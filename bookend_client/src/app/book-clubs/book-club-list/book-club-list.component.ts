import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { BookClub } from '../../_models/bookClub';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Member } from '../../_models/member';
import { CreateBookClubModalComponent } from '../../modals/create-book-club-modal/create-book-club-modal.component';
import { AccountService } from '../../_services/account.service';
import { take } from 'rxjs';
import { MemberService } from '../../_services/member.service';
import { ClubService } from '../../_services/club.service';

@Component({
  selector: 'app-book-club-list',
  templateUrl: './book-club-list.component.html',
  styleUrls: ['./book-club-list.component.css']
})
export class BookClubListComponent implements OnInit {
  user: User | null = null;
  member: Member | undefined;
  clubs: BookClub[] = [];
  bsModalRefCreateBookClub: BsModalRef<CreateBookClubModalComponent> = new BsModalRef<CreateBookClubModalComponent>();

  constructor(private modalService: BsModalService, private memberService: MemberService, public accountService: AccountService, public clubService: ClubService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
  }

  ngOnInit(): void {
    this.loadMember();
    this.loadClubs();
  }

  loadMember() {
    if (!this.user) return;
    this.memberService.getMember(this.user.userName).subscribe({
      next: member => this.member = member
    })
  }

  loadClubs() {
    if (!this.user) return;
    this.clubService.getBookClubs().subscribe({
      next: response => {
        if (response)
          {
            this.clubs = response;
          }
      }
    })
  }

  openCreateBookClubModal() {
    const config = {
      class: 'modal-dialog-centered'
    }
    this.bsModalRefCreateBookClub = this.modalService.show(CreateBookClubModalComponent, config);
    this.bsModalRefCreateBookClub.onHide?.subscribe({
      next: () => {
        const newBookClub = {
          clubName: this.bsModalRefCreateBookClub.content?.clubName
        }
        if (newBookClub.clubName) {
          this.clubService.createBookClub(newBookClub).subscribe({
            next: response => {
              if (response) {
                var club = JSON.parse(JSON.stringify(response)) as BookClub;
                this.clubs.push(club);
              }
            }
          })
        }
      }
    })
  }
}
