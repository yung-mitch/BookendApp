import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextInputComponent } from './_forms/text-input/text-input.component';
import { BookListComponent } from './books/book-list/book-list.component';
import { BookCardComponent } from './books/book-card/book-card.component';
import { BookDetailComponent } from './books/book-detail/book-detail.component';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MemberLibraryComponent } from './members/member-library/member-library.component';
import { BookClubListComponent } from './book-club-list/book-club-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ManagePublishedBooksComponent } from './books/manage-published-books/manage-published-books.component';
import { HasRoleDirective } from './_directives/has-role.directive';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BookEditModalComponent } from './modals/book-edit-modal/book-edit-modal.component';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { SharedModule } from './_modules/shared.module';
import { CreateBookModalComponent } from './modals/create-book-modal/create-book-modal.component';
import { CreateChapterModalComponent } from './modals/create-chapter-modal/create-chapter-modal.component';
import { ChapterEditModalComponent } from './modals/chapter-edit-modal/chapter-edit-modal.component';
import { ChapterReplaceFileModalComponent } from './modals/chapter-replace-file-modal/chapter-replace-file-modal.component';
import { MediaPlayerComponent } from './media-player/media-player.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    RegisterComponent,
    TextInputComponent,
    BookListComponent,
    BookCardComponent,
    BookDetailComponent,
    MemberCardComponent,
    MemberDetailComponent,
    MemberEditComponent,
    MemberLibraryComponent,
    BookClubListComponent,
    MessagesComponent,
    ManagePublishedBooksComponent,
    HasRoleDirective,
    BookEditModalComponent,
    CreateBookModalComponent,
    CreateChapterModalComponent,
    ChapterEditModalComponent,
    ChapterReplaceFileModalComponent,
    MediaPlayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
