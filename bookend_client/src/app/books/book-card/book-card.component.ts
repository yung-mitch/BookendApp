import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Book } from 'src/app/_models/book';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { BookService } from 'src/app/_services/book.service';
import { BookEditModalComponent } from 'src/app/modals/book-edit-modal/book-edit-modal.component';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent implements OnInit {
  @Input() book: Book | undefined;
  user: User | null = null;
  inUserLibrary: boolean = false;
  bsModalRef: BsModalRef<BookEditModalComponent> = new BsModalRef<BookEditModalComponent>();
  @Output() deleteBookEvent = new EventEmitter<number>();
  @Output() removeFromLibEvent = new EventEmitter<number>();

  constructor(private accountService: AccountService, private bookService: BookService, private modalService: BsModalService, private toastr: ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
  }

  ngOnInit(): void {
    if (this.user?.roles.includes("AppMember")) {
      if (this.book) {
        this.bookService.foundInUserLibrary(this.book.id).subscribe({
          next: response => {
            if (response)
            {
              this.inUserLibrary = response;
            }
          }
        })
      }
    }
  }

  addToLibrary() {
    if (this.book) {
      this.bookService.addToLibrary(this.book.id).subscribe({
        next: response => {
          if (response == this.book?.id)
          {
            this.inUserLibrary = !this.inUserLibrary;
          }
          this.toastr.success('Success! Book added to your library.');
        }
      })
    }
  }

  removeFromLibrary(bookId: number) {
    this.removeFromLibEvent.emit(bookId);
  }

  openBookEditModal(book: Book) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        title: book.title,
        author: book.author
      }
    }
    this.bsModalRef = this.modalService.show(BookEditModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        const title = this.bsModalRef.content?.model.title;
        const author = this.bsModalRef.content?.model.author;
        if (title != book.title || author != book.author) {
          const bookUpdate = {
            title: title,
            author: author
          }
          this.bookService.updateBook(bookUpdate, book.id).subscribe({
            next: () => {
              // this.toastr.success('Book updated successfully');
              if (this.book && bookUpdate.title && bookUpdate.author) {
                this.book.title = bookUpdate.title;
                this.book.author = bookUpdate.author;
              }
              this.toastr.success('Success! Changes saved to Book.')
            }
          });
        }
      }
    })
  }

  delete(bookId: number) {
    this.deleteBookEvent.emit(bookId);
  }
}
