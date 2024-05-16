import { Component, OnInit } from '@angular/core';
import { Chapter } from '../_models/chapter';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../_models/book';
import { BookService } from '../_services/book.service';
import { AudioStreamState } from '../_models/audioStreamState';
import { AudioService } from '../_services/audio.service';
import { Advertisement } from '../_models/advertisement';
import { AdvertisementService } from '../_services/advertisement.service';
import { Campaign } from '../_models/campaign';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.css']
})
export class MediaPlayerComponent implements OnInit {
  chapter: Chapter | undefined;
  chapterIndex: number | undefined;
  book: Book | undefined;
  campaigns: Campaign[] = [];
  campaignIndex = 0;
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
      this.populateCampaignsList();
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
      this.campaigns = [];
      console.log(this.book?.chapters[this.chapterIndex].id);
      this.router.navigateByUrl("/chapter/" + this.book?.chapters[this.chapterIndex].id);
      this.populateCampaignsList();
    }
  }

  next() {
    console.log(this.book?.chapters[this.chapterIndex!].id);
    if (this.chapterIndex != null && this.book?.chapters) {
      if (this.chapterIndex < this.book?.chapters.length - 1) {
        this.chapterIndex = this.chapterIndex + 1;
        this.chapter = this.book?.chapters[this.chapterIndex];
        this.campaigns = [];
        console.log(this.book?.chapters[this.chapterIndex].id);
        this.router.navigateByUrl("/chapter/" + this.book?.chapters[this.chapterIndex].id);
        this.populateCampaignsList();
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
      this.adService.incrementCampaignPlays(this.campaigns[this.campaignIndex].id).subscribe({
        next: () => console.log('Campaign plays incremented')
      })
      if (this.campaignIndex + 1 == this.campaigns.length) {
        this.adsPlayedBack = true;
        this.campaigns = [];
        if (this.chapter) {
          this.openChapterFile(this.chapter);
        }
      } else {
        this.campaignIndex = this.campaignIndex + 1;
        this.openAdvertisementFile(this.campaigns[this.campaignIndex].advertisement);
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

  private populateCampaignsList() {
    this.adService.getCampaignsToServe().subscribe({
      next: response => {
        if (response)
        {
          this.campaigns = response;
          if (this.campaigns.length > 0)
          {
            this.adsPlayedBack = false;
            this.campaignIndex = 0;
            this.openAdvertisementFile(this.campaigns[this.campaignIndex].advertisement);
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
