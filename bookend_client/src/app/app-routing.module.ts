import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberLibraryComponent } from './members/member-library/member-library.component';
import { BookListComponent } from './books/book-list/book-list.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MessagesComponent } from './messages/messages.component';
import { BookClubListComponent } from './book-clubs/book-club-list/book-club-list.component';
import { ManagePublishedBooksComponent } from './books/manage-published-books/manage-published-books.component';
import { BookDetailComponent } from './books/book-detail/book-detail.component';
import { bookDetailedResolver } from './_resolvers/book-detailed.resolver';
import { MediaPlayerComponent } from './media-player/media-player.component';
import { chapterDetailedResolver } from './_resolvers/chapter-detailed.resolver';
import { ManageAdvertisementsComponent } from './manage-advertisements/manage-advertisements.component';
import { BookClubDetailComponent } from './book-clubs/book-club-detail/book-club-detail.component';
import { clubDetailedResolver } from './_resolvers/club-detailed.resolver';
import { NotFoundComponent } from './errors/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: '',
    runGuardsAndResolvers: 'always',
    children: [
      {path: 'library', component: MemberLibraryComponent},
      {path: 'books', component: BookListComponent},
      {path: 'messages', component: MessagesComponent},
      {path: 'bookclubs', component: BookClubListComponent},
      {path: 'bookclubs/:clubId', component: BookClubDetailComponent, resolve: {club: clubDetailedResolver}},
      {path: 'member/edit', component: MemberEditComponent},
      {path: 'books/manage', component: ManagePublishedBooksComponent},
      {path: 'book/detail/:bookId', component: BookDetailComponent, resolve: {book: bookDetailedResolver}},
      {path: 'chapter/:chapterId', component: MediaPlayerComponent, resolve: {chapter: chapterDetailedResolver}},
      {path: 'advertisements/manage', component: ManageAdvertisementsComponent}
    ]},
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }