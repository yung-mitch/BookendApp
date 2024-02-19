import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-book-edit-modal',
  templateUrl: './book-edit-modal.component.html',
  styleUrls: ['./book-edit-modal.component.css']
})
export class BookEditModalComponent implements OnInit {
  model: any = {};
  title: string = '';
  author: string = '';

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  submit(): void {
    console.log(this.title, this.author);
    this.bsModalRef.hide();
  }
}
