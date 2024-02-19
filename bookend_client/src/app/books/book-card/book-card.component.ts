import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Book } from 'src/app/_models/book';
import { BookService } from 'src/app/_services/book.service';
import { BookEditModalComponent } from 'src/app/modals/book-edit-modal/book-edit-modal.component';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent implements OnInit {
  @Input() book: Book | undefined;
  bsModalRef: BsModalRef<BookEditModalComponent> = new BsModalRef<BookEditModalComponent>();
  @Output() deleteBookEvent = new EventEmitter<number>();

  constructor(private bookService: BookService, private modalService: BsModalService) { }

  ngOnInit(): void {
  }

  // addToLibrary(book: Book) {
    
  // }

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
        const title = this.bsModalRef.content?.title;
        const author = this.bsModalRef.content?.author;
        if (title != book.title || author != book.author) {
          const bookUpdate = {
            title: title,
            author: author
          }
          this.bookService.updateBook(bookUpdate, book.id).subscribe({
            next: () => {
              // this.toastr.success('Book updated successfully');
              // update the component to new values without refresh
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
