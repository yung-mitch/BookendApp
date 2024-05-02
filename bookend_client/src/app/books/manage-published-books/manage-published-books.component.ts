import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { take } from 'rxjs';
import { CreateBookModalComponent } from 'src/app/modals/create-book-modal/create-book-modal.component';
import { Book } from 'src/app/_models/book';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { BookService } from 'src/app/_services/book.service';
import { MemberService } from 'src/app/_services/member.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-published-books',
  templateUrl: './manage-published-books.component.html',
  styleUrls: ['./manage-published-books.component.css']
})
export class ManagePublishedBooksComponent implements OnInit {
  member: Member | undefined;
  user: User | null = null;
  books: Book[] = [];
  bsModalRef: BsModalRef<CreateBookModalComponent> = new BsModalRef<CreateBookModalComponent>();

  constructor(private accountService: AccountService, private memberService: MemberService,
    private bookService: BookService, private modalService: BsModalService,
    private toastr: ToastrService) {
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
    this.bookService.getPublishedBooks().subscribe({
      next: response => {
        if (response)
        {
          this.books = response;
        }
      }
    })
  }

  openCreateBookModal() {
    const config = {
      class: 'modal-dialog-centered'
    }
    this.bsModalRef = this.modalService.show(CreateBookModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        const newBook = {
          title: this.bsModalRef.content?.title,
          author: this.bsModalRef.content?.author
        }
        if (newBook.title && newBook.author) {
          this.bookService.createBook(newBook).subscribe({
            next: response => {
              if (response) {
                var book = JSON.parse(JSON.stringify(response)) as Book
                this.books.push(book);
                console.log(this.books);
                this.toastr.success('Success! New Book created');
              }
            }
          })
        }
      }
    })
  }

  deleteBook(bookId: number) {
    this.bookService.deleteBook(bookId).subscribe({
      next: () => {
        this.books = this.books.filter(x => x.id != bookId);
        this.toastr.success('Success! Book deleted');
      },
      error: error => {
        console.log(error);
        this.toastr.error('Something went wrong when attempting to delete the Book\n\n' + error);
      }
    })
  }
}
