import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-advertisement-edit-modal',
  templateUrl: './advertisement-edit-modal.component.html',
  styleUrls: ['./advertisement-edit-modal.component.css']
})
export class AdvertisementEditModalComponent implements OnInit{
  model: any = {};
  adName: string = '';

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }
}
