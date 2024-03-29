import { Component, OnInit } from '@angular/core';
import { Chapter } from '../_models/chapter';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../_models/book';
import { BookService } from '../_services/book.service';
import { AudioStreamState } from '../_models/audioStreamState';
import { AudioService } from '../_services/audio.service';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.css']
})
export class MediaPlayerComponent implements OnInit {
  chapter: Chapter | undefined;
  chapterIndex: number | undefined;
  book: Book | undefined;
  
  state: AudioStreamState | undefined;

  constructor(private bookService: BookService, private route: ActivatedRoute, public audioService: AudioService) {
    this.audioService.getState().subscribe(state => {
      this.state = state;
    })
  }
  
  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.chapter = data["chapter"]
      },
      error: error => {
        console.log(error);
      }
    })

    this.loadBook();

    console.log(this.chapter);
    
    if (this.chapter) {
      this.openFile(this.chapter);
    }
  }

  loadBook() {
    if (!this.chapter) return;
      
    this.bookService.getBook(this.chapter.bookId).subscribe({
      next: response => {
        if (response) {
          this.book = response;
          console.log(this.book);
          var chapter = this.book?.chapters.find(chapter => chapter.id == this.chapter?.id);
          if (chapter) {
            this.chapterIndex = this.book?.chapters.indexOf(chapter);
          }
        }
      }
    })
  }

  playAudioStream(url: string) {
    this.audioService.playStream(url).subscribe(events => {

    });
  }

  openFile(chapter: Chapter) {
    this.chapter = chapter;
    this.audioService.stop();
    this.playAudioStream(chapter.url);
    console.log(this.state);
  }

  play() {
    this.audioService.play();
  }

  pause() {
    this.audioService.pause();
  }

  // Save the below methods for if refactor this component to populate the whole list of chapter URLS and navigate by loading only the file, not the whole component

  previous() {
    this.chapterIndex = this.chapterIndex! - 1;
    this.chapter = this.book?.chapters[this.chapterIndex];
    this.openFile(this.chapter!);
  }

  next() {
    this.chapterIndex = this.chapterIndex! + 1;
    this.chapter = this.book?.chapters[this.chapterIndex];
    this.openFile(this.chapter!);
  }

  onSliderChangeLift(liftTime: number) {
    this.audioService.seekTo(liftTime);
  }

  stop() {
    this.audioService.stop();
  }

  jumpSeek(timestamp: number) {
    this.audioService.seekTo(timestamp);
  }
}
