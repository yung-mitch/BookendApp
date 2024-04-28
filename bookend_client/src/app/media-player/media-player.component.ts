import { Component, OnInit } from '@angular/core';
import { Chapter } from '../_models/chapter';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../_models/book';
import { BookService } from '../_services/book.service';
import { AudioStreamState } from '../_models/audioStreamState';
import { AudioService } from '../_services/audio.service';
import { Advertisement } from '../_models/advertisement';
import { AdvertisementService } from '../_services/advertisement.service';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.css']
})
export class MediaPlayerComponent implements OnInit {
  chapter: Chapter | undefined;
  chapterIndex: number | undefined;
  book: Book | undefined;
  ads: Advertisement[] = [];
  adIndex = 0;
  adsPlayedBack = false;
  filePlaybackTouched = false;
  
  state: AudioStreamState | undefined;

  constructor(private bookService: BookService, private route: ActivatedRoute,
    public audioService: AudioService, private adService: AdvertisementService, private router: Router) {
    this.audioService.getState().subscribe({
      next: state => {
        this.state = state;
        if (this.state.currentTime && this.state.totalDuration && this.filePlaybackTouched) {
          if (this.state.currentTime >= this.state.totalDuration) {
            console.log(this.state.currentTime, this.state.totalDuration);
            // this.filePlaybackTouched = false;
            this.filePlaybackEnded();
          }
        }
      }
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

    // do some other things while the book is loaded
    console.log(this.chapter);
    
    if (this.chapter) {
      this.populateAdsList();
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

  openChapterFile(chapter: Chapter) {
    this.chapter = chapter;
    this.audioService.stop();
    this.playAudioStream(chapter.url);
    console.log(this.state);
  }

  play() {
    this.audioService.play();
    this.filePlaybackTouched = true;
  }

  pause() {
    this.audioService.pause();
  }

  // Save the below methods for if refactor this component to populate the whole list of chapter URLS and navigate by loading only the file, not the whole component

  previous() {
    console.log(this.book?.chapters[this.chapterIndex!].id);
    if (this.chapterIndex != 0) {
      this.chapterIndex = this.chapterIndex! - 1;
      this.chapter = this.book?.chapters[this.chapterIndex];
      this.ads = [];
      console.log(this.book?.chapters[this.chapterIndex].id);
      this.router.navigateByUrl("/chapter/" + this.book?.chapters[this.chapterIndex].id);
      this.populateAdsList();
      // this.openChapterFile(this.chapter!);
    }
  }

  next() {
    console.log(this.book?.chapters[this.chapterIndex!].id);
    if (this.chapterIndex != null && this.book?.chapters) {
      if (this.chapterIndex < this.book?.chapters.length - 1) {
        this.chapterIndex = this.chapterIndex + 1;
        this.chapter = this.book?.chapters[this.chapterIndex];
        this.ads = [];
        console.log(this.book?.chapters[this.chapterIndex].id);
        this.router.navigateByUrl("/chapter/" + this.book?.chapters[this.chapterIndex].id);
        this.populateAdsList();
        // this.openChapterFile(this.chapter!);
      }
    }
  }

  onSliderChangeLift(liftTime: number) {
    if (this.state?.totalDuration && liftTime >= this.state?.totalDuration) {
      console.log(liftTime);
      console.log(this.state);
      this.filePlaybackEnded();
    } else {
      this.audioService.seekTo(liftTime);
    }
  }

  filePlaybackEnded() {
    this.filePlaybackTouched = false;
    if (!this.adsPlayedBack) {
      if (this.adIndex + 1 == this.ads.length && this.chapter) {
        this.adsPlayedBack = true;
        this.ads = [];
        this.openChapterFile(this.chapter);
      } else {
        this.adIndex = this.adIndex + 1;
        this.openAdvertisementFile(this.ads[this.adIndex])
      }
    } else if (this.chapter) {
      this.next();
    }
    console.log(this.adsPlayedBack);
  }

  stop() {
    this.audioService.stop();
  }

  jumpSeek(timestamp: number) {
    if (this.adsPlayedBack) {
      this.audioService.seekTo(timestamp);
    } else {
      // this.toastr.error("Finish the ad to jump to this comment's location");
    }
  }

  private populateAdsList() {
    this.adService.getAdvertisementsToServe().subscribe({
      next: response => {
        if (response)
        {
          this.ads = response;
          if (this.ads.length > 0)
          {
            this.adsPlayedBack = false;
            this.adIndex = 0;
            this.openAdvertisementFile(this.ads[this.adIndex]);
          }
        }
      },
      error: error => {
        console.log(error);
      }
    })
  }

  private openAdvertisementFile(ad: Advertisement){
    console.log(ad);
    this.audioService.stop();
    this.playAudioStream(ad.url);
    console.log(this.state);
    console.log(this.adsPlayedBack);
  }
  
}
