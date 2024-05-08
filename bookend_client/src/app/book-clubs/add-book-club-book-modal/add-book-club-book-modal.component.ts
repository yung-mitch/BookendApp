import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Book } from 'src/app/_models/book';
import { BookParams } from 'src/app/_models/bookParams';
import { Pagination } from 'src/app/_models/pagination';
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
  pagination: Pagination | undefined;
  bookParams: BookParams | undefined;
  searchString: string = '';
  searched = false;

  constructor(private bookService: BookService, private toastr: ToastrService, public bsModalRef: BsModalRef) {
    this.bookParams = new BookParams();
  }

  ngOnInit(): void {
    // this.loadBooks();
  }

  loadBooks() {
    if (this.bookParams) {
      this.bookService.getBooks(this.bookParams).subscribe({
        next: response => {
          if (response.result && response.pagination) {
            if (response.result.length > 0) {
              this.otherBooks = response.result;
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
  }

  addNewBook() {
    if (this.newBookId) {
      console.log(this.newBookId);
      this.bsModalRef.hide();
    }
  }

  searchBooks() {
    if (this.bookParams && this.searchString != '') {
      this.bookParams.searchString = this.searchString;
      console.log(this.bookParams.searchString);
      this.loadBooks();
    } else {
      this.toastr.error("Entered a valid search term");
    }
  }

  pageChanged(event: any) {
    if (this.bookParams && this.bookParams?.pageNumber !== event.page) {
      this.bookParams.pageNumber = event.page;
      this.loadBooks();
    }
  }
}
