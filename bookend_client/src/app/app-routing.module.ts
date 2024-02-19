import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberLibraryComponent } from './members/member-library/member-library.component';
import { BookListComponent } from './books/book-list/book-list.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MessagesComponent } from './messages/messages.component';
import { BookClubListComponent } from './book-club-list/book-club-list.component';
import { ManagePublishedBooksComponent } from './books/manage-published-books/manage-published-books.component';
import { BookDetailComponent } from './books/book-detail/book-detail.component';
import { bookDetailedResolver } from './_resolvers/book-detailed.resolver';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: '',
    children: [
      {path: 'library', component: MemberLibraryComponent},
      {path: 'books', component: BookListComponent},
      {path: 'messages', component: MessagesComponent},
      {path: 'bookclubs', component: BookClubListComponent},
      {path: 'member/edit', component: MemberEditComponent},
      {path: 'books/manage', component: ManagePublishedBooksComponent},
      {path: 'book/detail/:bookId', component: BookDetailComponent, resolve: {book: bookDetailedResolver}}
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }