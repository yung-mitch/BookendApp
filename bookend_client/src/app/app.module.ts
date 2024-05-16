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
import { BookClubListComponent } from './book-clubs/book-club-list/book-club-list.component';
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
import { ManageAdvertisementsComponent } from './manage-advertisements/manage-advertisements.component';
import { CreateAdvertisementModalComponent } from './modals/create-advertisement-modal/create-advertisement-modal.component';
import { AdvertisementEditModalComponent } from './modals/advertisement-edit-modal/advertisement-edit-modal.component';
import { AdvertisementReplaceFileModalComponent } from './modals/advertisement-replace-file-modal/advertisement-replace-file-modal.component';
import { ReviewsListComponent } from './books/reviews-list/reviews-list.component';
import { ChapterCommentsListComponent } from './books/chapter-comments-list/chapter-comments-list.component';
import { ChapterCommentComponent } from './books/chapter-comment/chapter-comment.component';
import { ReviewComponent } from './books/review/review.component';
import { PhotoEditorModalComponent } from './members/photo-editor-modal/photo-editor-modal.component';
import { CreateBookClubModalComponent } from './modals/create-book-club-modal/create-book-club-modal.component';
import { BookClubDetailComponent } from './book-clubs/book-club-detail/book-club-detail.component';
import { AddBookClubMemberModalComponent } from './book-clubs/add-book-club-member-modal/add-book-club-member-modal.component';
import { EditBookClubModalComponent } from './book-clubs/edit-book-club-modal/edit-book-club-modal.component';
import { AddBookClubBookModalComponent } from './book-clubs/add-book-club-book-modal/add-book-club-book-modal.component';
import { BookClubBookCardComponent } from './books/book-club-book-card/book-club-book-card.component';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import { ErrorInterceptor } from './_interceptors/error.interceptor';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { CreateCampaignModalComponent } from './modals/create-campaign-modal/create-campaign-modal.component';
import { CampaignEditModalComponent } from './modals/campaign-edit-modal/campaign-edit-modal.component';

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
    MediaPlayerComponent,
    ManageAdvertisementsComponent,
    CreateAdvertisementModalComponent,
    AdvertisementEditModalComponent,
    AdvertisementReplaceFileModalComponent,
    ReviewsListComponent,
    ChapterCommentsListComponent,
    ChapterCommentComponent,
    ReviewComponent,
    PhotoEditorModalComponent,
    CreateBookClubModalComponent,
    BookClubDetailComponent,
    AddBookClubMemberModalComponent,
    EditBookClubModalComponent,
    AddBookClubBookModalComponent,
    BookClubBookCardComponent,
    NotFoundComponent,
    CreateCampaignModalComponent,
    CampaignEditModalComponent
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
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
