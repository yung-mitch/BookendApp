import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Book } from 'src/app/_models/book';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { BookService } from 'src/app/_services/book.service';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-library',
  templateUrl: './member-library.component.html',
  styleUrls: ['./member-library.component.css']
})
export class MemberLibraryComponent implements OnInit{
  member: Member | undefined;
  user: User | null = null;
  books: Book[] = [];

  constructor(private accountService: AccountService, private memberService: MemberService,
    private bookService: BookService, private toastr: ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
  }

  ngOnInit(): void {
    this.loadMember();
    this.loadBooks();
  }

  loadMember() {
    if (!this.user) return;
    this.memberService.getMember(this.user.userName).subscribe({
      next: member => this.member = member
    })
  }

  loadBooks() {
    if (!this.user) return;
    this.bookService.getLibrary().subscribe({
      next: response => {
        if (response)
        {
          this.books = response;
        }
      }
    })
  }

  removeFromLib(bookId: number) {
    this.bookService.removeFromLibrary(bookId).subscribe({
      next: () => {
        this.books = this.books.filter(x => x.id != bookId);
        this.toastr.success('Success! The Book has been removed from your library');
      },
      error: error => {
        console.log(error);
        this.toastr.error('Something went wrong when attempting to remove the Book from your library\n\n' + error);
      }
    })
  }
}
