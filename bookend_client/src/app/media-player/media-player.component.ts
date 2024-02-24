import { Component, OnInit } from '@angular/core';
import { Chapter } from '../_models/chapter';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.css']
})
export class MediaPlayerComponent implements OnInit {
  chapter: Chapter | undefined;

  constructor(private route: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => this.chapter = data["chapter"]
    })

    console.log(this.chapter);
  }
}
