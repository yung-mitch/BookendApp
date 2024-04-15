import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BookClub } from 'src/app/_models/bookClub';

@Component({
  selector: 'app-edit-book-club-modal',
  templateUrl: './edit-book-club-modal.component.html',
  styleUrls: ['./edit-book-club-modal.component.css']
})
export class EditBookClubModalComponent implements OnInit {
  clubName: string = '';

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

}