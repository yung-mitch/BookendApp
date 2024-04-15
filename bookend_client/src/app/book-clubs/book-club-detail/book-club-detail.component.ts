import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { take } from 'rxjs';
import { Book } from 'src/app/_models/book';
import { BookClub } from 'src/app/_models/bookClub';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { BookService } from 'src/app/_services/book.service';
import { ClubService } from 'src/app/_services/club.service';
import { MemberService } from 'src/app/_services/member.service';
import { EditBookClubModalComponent } from '../edit-book-club-modal/edit-book-club-modal.component';
import { AddBookClubMemberModalComponent } from '../add-book-club-member-modal/add-book-club-member-modal.component';
import { AddBookClubBookModalComponent } from '../add-book-club-book-modal/add-book-club-book-modal.component';

@Component({
  selector: 'app-book-club-detail',
  templateUrl: './book-club-detail.component.html',
  styleUrls: ['./book-club-detail.component.css']
})
export class BookClubDetailComponent implements OnInit {
  user: User | null = null;
  member: Member | undefined;
  club: BookClub | undefined;
  clubMembers: Member[] = [];
  books: Book[] = [];
  bsModalRefEditBookClub: BsModalRef<EditBookClubModalComponent> = new BsModalRef<EditBookClubModalComponent>();
  bsModalRefAddBookClubMember: BsModalRef<AddBookClubMemberModalComponent> = new BsModalRef<AddBookClubMemberModalComponent>();
  bsModalRefAddBookClubBook: BsModalRef<AddBookClubBookModalComponent> = new BsModalRef<AddBookClubBookModalComponent>();
  
  constructor(private route: ActivatedRoute, private clubService: ClubService, private bookService: BookService,
    private accountService: AccountService, private modalService: BsModalService, public memberService: MemberService,
    private router: Router) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
  }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => this.club = data["club"]
    })

    this.loadMember();
    this.loadBooks();
    this.loadClubMembers();
  }

  loadMember() {
    if (!this.user) return;
    this.memberService.getMember(this.user.userName).subscribe({
      next: member => this.member = member
    })
    
  }

  loadBooks() {
    if (!this.user || !this.club) return;
    this.clubService.getBookClubBooks(this.club.id).subscribe({
      next: response => {
        if (response)
        {
          this.books = response;
        }
      }
    })
  }

  loadClubMembers() {
    if (!this.user || !this.club) return;
    this.clubService.getBookClubMembers(this.club.id).subscribe({
      next: response => {
        if (response)
          {
            this.clubMembers = response;
          }
      }
    })
  }

  openEditBookClubModal() {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        clubName: this.club?.clubName
      }
    }
    this.bsModalRefEditBookClub = this.modalService.show(EditBookClubModalComponent, config);
    this.bsModalRefEditBookClub.onHide?.subscribe({
      next: () => {
        const clubUpdate = {
          clubName: this.bsModalRefEditBookClub.content?.clubName
        }
        if (clubUpdate.clubName && clubUpdate.clubName != this.club?.clubName && this.club) {
          console.log(clubUpdate);
          this.clubService.updateBookClub(clubUpdate, this.club?.id).subscribe({
            next: () => {
              
            }
          })
        
          if (this.club && clubUpdate.clubName) {
            this.club.clubName = clubUpdate.clubName;
          }
        }
      }
    })
  }

  openAddBookClubMemberModal() {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        clubMembers: this.clubMembers
      }
    }
    this.bsModalRefAddBookClubMember = this.modalService.show(AddBookClubMemberModalComponent, config);
    this.bsModalRefAddBookClubMember.onHide?.subscribe({
      next: () => {
        const newMember = {
          newMemberId: this.bsModalRefAddBookClubMember.content?.newMemberId
        }
        if (newMember.newMemberId && this.club) {
          this.clubService.addBookClubMember(this.club.id, newMember.newMemberId).subscribe({
            next: () => {
              this.ngOnInit();
            }
          })
        }
      }
    })
  }

  openAddBookClubBookModal() {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        clubBooks: this.books
      }
    }
    this.bsModalRefAddBookClubBook = this.modalService.show(AddBookClubBookModalComponent, config);
    this.bsModalRefAddBookClubBook.onHide?.subscribe({
      next: () => {
        const newBook = {
          newBookId: this.bsModalRefAddBookClubBook.content?.newBookId
        }
        if (newBook.newBookId && this.club) {
          this.clubService.addBookClubBook(this.club.id, newBook.newBookId).subscribe({
            next: () => {
              this.ngOnInit();
            }
          })
        }
      }
    })
  }

  removeBookClubMember(userId: number) {
    if (this.club && this.member?.id == this.club.owningUserId) {
      this.clubService.removeBookClubMember(this.club.id, userId).subscribe({
        next: () => {
          this.clubMembers = this.clubMembers.filter(x => x.id != userId);
        },
        error: error => {
          console.log(error);
        }
      })
    }
  }

  removeBookClubBook(bookId: number) {
    if (this.club && this.member?.id == this.club.owningUserId) {
      this.clubService.removeBookClubBook(this.club.id, bookId).subscribe({
        next: () => {
          this.books = this.books.filter(x => x.id != bookId);
        },
        error: error => {
          console.log(error);
        }
      })
    }
  }

  deleteBookClub() {
    if (this.club && this.member?.id == this.club.owningUserId) {
      this.clubService.deleteBookClub(this.club.id).subscribe({
        next: response => {
          console.log("Book Club Deleted");
          this.router.navigateByUrl('/bookclubs');
        }
      })
    }
  }
}
