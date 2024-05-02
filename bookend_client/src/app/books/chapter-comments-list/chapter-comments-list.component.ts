import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Duration } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { AudioStreamState } from 'src/app/_models/audioStreamState';
import { Chapter } from 'src/app/_models/chapter';
import { ChapterComment } from 'src/app/_models/chapterComment';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { AudioService } from 'src/app/_services/audio.service';
import { BookService } from 'src/app/_services/book.service';

@Component({
  selector: 'app-chapter-comments-list',
  templateUrl: './chapter-comments-list.component.html',
  styleUrls: ['./chapter-comments-list.component.css']
})
export class ChapterCommentsListComponent implements OnInit{
  @Input() chapter: Chapter | undefined;
  chapterComments: ChapterComment[] = [];
  user: User | null = null;
  addCommentMode = false;
  model: any = {};
  commentTriggerTimestamp: number = 0;
  state: AudioStreamState | undefined;
  editCommentForm = false;
  @Output() jumpToCommentTimestampEvent = new EventEmitter<number>();

  constructor(private bookService: BookService, private accountService: AccountService, private audioService: AudioService, private toastr: ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
  }

  ngOnInit(): void {
    this.loadAudioState();
    this.loadComments();
  }

  loadAudioState() {
    if (!this.chapter) return;
    this.audioService.getState().subscribe(state => {
      this.state = state;
    })
  }

  loadComments() {
    if (!this.chapter) return;
    this.bookService.getChapterComments(this.chapter.id).subscribe({
      next: response => {
        if (response)
        {
          this.chapterComments = response;
          for (let i = 0; i < this.chapterComments.length; i++) {
            this.chapterComments[i].readableTimestamp = this.formatTimestamp(this.chapterComments[i].timestamp);
          }
          console.log(this.chapterComments);
        }
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    this.loadComments();
  }

  jumpSeek(timestamp: number) {
    this.jumpToCommentTimestampEvent.emit(timestamp);
  }

  toggleAddCommentForm() {
    this.addCommentMode = !this.addCommentMode;
  }

  toggleEditCommentForm() {
    this.editCommentForm = !this.editCommentForm;
  }

  addCommentTrigger() {
    this.toggleAddCommentForm();
    if (this.state?.currentTime)
    {
      this.commentTriggerTimestamp = (Math.floor(this.state.currentTime));
    }
  }

  createComment() {
    if (this.chapter) {
      this.model.timestamp = this.commentTriggerTimestamp;
      console.log(this.model);
  
      this.bookService.createChapterComment(this.chapter.id, this.model).subscribe({
        next: response => {
          if (response) {
            var chapterComment = JSON.parse(JSON.stringify(response)) as ChapterComment;
            if (this.user)
            {
              chapterComment.commentingUserName = this.user.userName;
              chapterComment.readableTimestamp = this.formatTimestamp(chapterComment.timestamp);
            }
            this.chapterComments.push(chapterComment);
            console.log(this.chapterComments);

            this.toggleAddCommentForm();
            this.toastr.success('Success! Comment added');
          }
        }
      })
    }
  }

  updateChapterCommentList(commentId: number) {
    this.chapterComments = this.chapterComments.filter(x => x.id != commentId);
  }

  formatTimestamp(timestamp: number) {
    var dur = Duration.fromObject({ seconds: timestamp });
    return (dur.hours == 0) ? dur.toFormat('mm:ss') : dur.toFormat('hh:mm:ss');
  }
}
