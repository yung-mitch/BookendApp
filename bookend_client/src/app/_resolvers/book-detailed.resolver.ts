import { ResolveFn } from '@angular/router';
import { Book } from '../_models/book';
import { inject } from '@angular/core';
import { BookService } from '../_services/book.service';

export const bookDetailedResolver: ResolveFn<Book> = (route, state) => {
  const bookService = inject(BookService)

  return bookService.getBook(parseInt(route.paramMap.get('bookId')!))
};
