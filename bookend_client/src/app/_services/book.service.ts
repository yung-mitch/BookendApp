import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Book } from '../_models/book';
import { AccountService } from './account.service';
import { map, of, take } from 'rxjs';
import { User } from '../_models/user';
import { BookParams } from '../_models/bookParams';
import { Chapter } from '../_models/chapter';
import { Review } from '../_models/review';
import { ChapterComment } from '../_models/chapterComment';

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

  getBooks() {
    // const response = this.bookCache.get(Object.values(bookParams).join('-'));

    // if (response) return of(response);

    return this.http.get<Book[]>(this.baseUrl + 'books');
  }

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

  getChapter(chapterId: number) {
    // opportunity to add caching here to improve performance
    return this.http.get<Chapter>(this.baseUrl + 'books/chapter/' + chapterId);
  }

  // addChapter handled by ng2-file-upload FileUploader

  updateChapter(chapter: any, chapterId: number) {
    return this.http.put(this.baseUrl + 'books/' + 'update-chapter/' + chapterId, chapter)
  }

  deleteChapter(bookId: number, chapterId: number) {
    return this.http.delete(this.baseUrl + 'books/delete-chapter/' + bookId + '/' + chapterId);
  }

  getLibrary() {
    return this.http.get<Book[]>(this.baseUrl + 'library');
  }

  addToLibrary(bookId: number) {
    return this.http.post<number>(this.baseUrl + 'library/add?bookId=' + bookId, {});
  }

  removeFromLibrary(bookId: number) {
    return this.http.delete(this.baseUrl + 'library/remove?bookId=' + bookId);
  }

  foundInUserLibrary(bookId: number) {
    return this.http.get<boolean>(this.baseUrl + 'library/' + bookId);
  }

  getBookReviews(bookId: number) {
    return this.http.get<Review[]>(this.baseUrl + 'books/reviews/' + bookId);
  }

  createBookReview(bookId: number, reviewDto: any) {
    return this.http.post<Review>(this.baseUrl + 'books/add-review/' + bookId, reviewDto);
  }

  updateBookReview(reviewId: number, reviewUpdateDto: any) {
    return this.http.put(this.baseUrl + 'books/update-review/' + reviewId, reviewUpdateDto)
  }

  deleteBookReview(reviewId: number) {
    return this.http.delete(this.baseUrl + 'books/delete-review/' + reviewId);
  }

  getChapterComments(chapterId: number) {
    return this.http.get<ChapterComment[]>(this.baseUrl + "books/comments/" + chapterId);
  }

  createChapterComment(chapterId: number, commentDto: any) {
    return this.http.post(this.baseUrl + 'books/add-comment/' + chapterId, commentDto);
  }

  updateChapterComment(commentId: number, commentUpdateDto: any) {
    return this.http.put(this.baseUrl + 'books/update-comment/' + commentId, commentUpdateDto);
  }

  deleteChapterComment(commentId: number) {
    return this.http.delete(this.baseUrl + 'books/delete-comment/' + commentId);
  }
}
