import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-book-modal',
  templateUrl: './create-book-modal.component.html',
  styleUrls: ['./create-book-modal.component.css']
})
export class CreateBookModalComponent implements OnInit{
  title: string = '';
  author: string = '';

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }
}
