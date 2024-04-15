import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-book-club-modal',
  templateUrl: './create-book-club-modal.component.html',
  styleUrls: ['./create-book-club-modal.component.css']
})
export class CreateBookClubModalComponent implements OnInit {
  clubName: string = '';

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }
}
