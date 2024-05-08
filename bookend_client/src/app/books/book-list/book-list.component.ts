import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Book } from 'src/app/_models/book';
import { BookParams } from 'src/app/_models/bookParams';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { BookService } from 'src/app/_services/book.service';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  member: Member | undefined;
  user: User | null = null;
  books: Book[] = [];
  pagination: Pagination | undefined;
  bookParams: BookParams | undefined;
  searchString: string = '';
  searched = false;

  constructor(private accountService: AccountService, private memberService: MemberService,
    private bookService: BookService, private toastr: ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        this.user = user;
        this.bookParams = new BookParams();
      }
    })
  }

  ngOnInit(): void {
    this.loadMember();
    // this.loadBooks();
  }

  loadMember() {
    if (!this.user) return;
    this.memberService.getMember(this.user.userName).subscribe({
      next: member => this.member = member
    })
  }

  loadBooks() {
    if (!this.user || !this.bookParams) return;
    this.bookService.getBooks(this.bookParams).subscribe({
      next: response => {
        if (response.result && response.pagination)
        {
          this.searchString = '';

          if (response.result.length > 0) {
            this.books = response.result;
            this.pagination = response.pagination;
            this.searched = true;
          } else {
            this.toastr.error('No titles matched your search. Try searching for something else.');
          }
        } else {
          this.toastr.error('Something went wrong when performing your search. Try searching our library again.');
        }
      }
    })
  }

  searchBooks() {
    if (this.bookParams) {
      this.bookParams.searchString = this.searchString;
      console.log(this.bookParams.searchString);
      this.loadBooks();
    }
  }

  browseAllBooks() {
    this.searchString = '';
    this.searchBooks();
  }

  resetSearchString() {
    if (this.searchString != '') this.searchString = '';
  }

  pageChanged(event: any) {
    if (this.bookParams && this.bookParams?.pageNumber !== event.page) {
      this.bookParams.pageNumber = event.page;
      this.loadBooks();
    }
  }
}
