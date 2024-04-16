import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Book } from 'src/app/_models/book';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chapter-edit-modal',
  templateUrl: './chapter-edit-modal.component.html',
  styleUrls: ['./chapter-edit-modal.component.css']
})
export class ChapterEditModalComponent implements OnInit {
  @Input() book: Book | undefined;
  model: any = {};
  title: string = '';
  chapterId: number | undefined;
  baseUrl = environment.apiUrl;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }
}
