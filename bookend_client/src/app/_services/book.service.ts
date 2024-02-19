import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Book } from '../_models/book';
import { AccountService } from './account.service';
import { map, of, take } from 'rxjs';
import { User } from '../_models/user';
import { BookParams } from '../_models/bookParams';
import { Chapter } from '../_models/chapter';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  baseUrl = environment.apiUrl;
  books: Book[] = [];
  bookCache = new Map();
  bookParams: BookParams | undefined;
  user: User | undefined;

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.user = user;
        }
      }
    })
  }

  // getAllBooks(bookParams: BookParams) {
  //   const response = this.bookCache.get(Object.values(bookParams).join('-'));

  //   if (response) return of(response);

  //   let
  // }

  getPublishedBooks() {
    return this.http.get<Book[]>(this.baseUrl + 'books/published');
  }

  getBook(bookId: number) {
    const book = [...this.bookCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((book: Book) => book.id === bookId);

    if (book) return of(book);

    return this.http.get<Book>(this.baseUrl + 'books/' + bookId);
  }

  createBook(book: any) {
    return this.http.post(this.baseUrl + 'books/create-book', book);
    // .pipe(
    //   map((book) => {
    //     this.books.push(book)
    //   })
    // );
  }

  updateBook(book: any, bookId: number) {
    console.log(book);
    console.log(this.baseUrl + 'books/' + bookId);
    return this.http.put(this.baseUrl + 'books/' + bookId, book).pipe(
      map(() => {
        const index = this.books.indexOf(book);
        this.books[index] = {...this.books[index], ...book}
      })
    );
  }

  deleteBook(bookId: number) {
    return this.http.delete(this.baseUrl + 'books/delete-book/' + bookId);
  }

  // addChapter handled by ng2-file-upload FileUploader

  updateChapter(chapter: any, chapterId: number) {
    return this.http.put(this.baseUrl + 'books/' + 'update-chapter/' + chapterId, chapter)
  }

  deleteChapter(bookId: number, chapterId: number) {
    return this.http.delete(this.baseUrl + 'books/delete-chapter/' + bookId + '/' + chapterId);
  }
}
