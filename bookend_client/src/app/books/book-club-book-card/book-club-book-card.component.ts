import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BookCardComponent } from '../book-card/book-card.component';
import { BookClub } from 'src/app/_models/bookClub';
import { Member } from 'src/app/_models/member';

@Component({
  selector: 'app-book-club-book-card',
  templateUrl: './book-club-book-card.component.html',
  styleUrls: ['./book-club-book-card.component.css']
})
export class BookClubBookCardComponent extends BookCardComponent implements OnInit{
  @Input() club: BookClub | undefined;
  @Input() member: Member | undefined;
  @Output() removeFromClubEvent = new EventEmitter<number>();

  removeBookFromClub(bookId: number) {
    this.removeFromClubEvent.emit(bookId);
  }
}
