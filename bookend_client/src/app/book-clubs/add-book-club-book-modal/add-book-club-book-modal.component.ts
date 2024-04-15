import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Book } from 'src/app/_models/book';
import { BookService } from 'src/app/_services/book.service';

@Component({
  selector: 'app-add-book-club-book-modal',
  templateUrl: './add-book-club-book-modal.component.html',
  styleUrls: ['./add-book-club-book-modal.component.css']
})
export class AddBookClubBookModalComponent implements OnInit {
  clubBooks: Book[] = [];
  otherBooks: Book[] = [];
  newBookId: number | null = null;

  constructor(private bookService: BookService, public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe({
      next: response => {
        if (response) {
          this.otherBooks = response.filter(x => !this.clubBooks.includes(x))
        }
      }
    })
  }

  addNewBook() {
    if (this.newBookId) {
      console.log(this.newBookId);
      this.bsModalRef.hide();
    }
  }
}
