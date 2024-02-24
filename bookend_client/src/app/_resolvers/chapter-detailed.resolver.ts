import { ResolveFn } from '@angular/router';
import { Chapter } from '../_models/chapter';
import { inject } from '@angular/core';
import { BookService } from '../_services/book.service';

export const chapterDetailedResolver: ResolveFn<Chapter> = (route, state) => {
  const bookService = inject(BookService)

  return bookService.getChapter(parseInt(route.paramMap.get('chapterId')!))
};
