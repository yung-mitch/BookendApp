import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Duration } from 'luxon';
import { take } from 'rxjs';
import { ChapterComment } from 'src/app/_models/chapterComment';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { BookService } from 'src/app/_services/book.service';

@Component({
  selector: 'app-chapter-comment',
  templateUrl: './chapter-comment.component.html',
  styleUrls: ['./chapter-comment.component.css']
})
export class ChapterCommentComponent implements OnInit {
  @Input() chapterComment: ChapterComment | undefined;
  user: User | null = null;
  editCommentForm = false;
  model: any = {};
  @Output() emitTimestampEvent = new EventEmitter<number>();
  @Output() chapterCommentDeleted = new EventEmitter<number>();

  constructor(private accountService: AccountService, private bookService: BookService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
  }

  ngOnInit(): void {
  }

  jumpSeek(timestamp: number) {
    this.emitTimestampEvent.emit(timestamp);
  }

  toggleEditCommentForm() {
    this.editCommentForm = !this.editCommentForm;
  }

  updateComment() {
    if (this.chapterComment)
    {
      this.model.timestamp = this.chapterComment?.timestamp;
      console.log(this.model);
      this.bookService.updateChapterComment(this.chapterComment.id, this.model).subscribe({
        next: () => {
          this.chapterComment!.timestamp = this.model.timestamp;
          this.chapterComment!.readableTimestamp = this.formatTimestamp(this.chapterComment!.timestamp);
          this.chapterComment!.commentText = this.model.commentText;
          this.model = {};

          this.toggleEditCommentForm();
        }
      })
    }
  }

  deleteComment() {
    if (this.chapterComment)
    {
      this.bookService.deleteChapterComment(this.chapterComment.id).subscribe({
        next: () => {
          this.chapterCommentDeleted.emit(this.chapterComment?.id);
        }
      })
    }
  }

  formatTimestamp(timestamp: number) {
    var dur = Duration.fromObject({ seconds: timestamp });
    return (dur.hours == 0) ? dur.toFormat('mm:ss') : dur.toFormat('hh:mm:ss');
  }
}
