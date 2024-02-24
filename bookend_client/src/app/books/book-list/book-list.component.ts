import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Book } from 'src/app/_models/book';
import { Member } from 'src/app/_models/member';
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

  constructor(private accountService: AccountService, private memberService: MemberService, private bookService: BookService) {
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
    this.memberService.getMember(this.user.username).subscribe({
      next: member => this.member = member
    })
  }

  loadBooks() {
    if (!this.user) return;
    this.bookService.getBooks().subscribe({
      next: response => {
        if (response)
        {
          this.books = response;
        }
      }
    })
  }
}
