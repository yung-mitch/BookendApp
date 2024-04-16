import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FileUploadModule } from 'ng2-file-upload';
import { MaterialModule } from './material.module';
import { NgxSpinnerModule } from 'ngx-spinner';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    FileUploadModule,
    MaterialModule,
    NgxSpinnerModule.forRoot({ type: 'line-scale-pulse-out' })
  ],
  exports: [
    BsDropdownModule,
    ModalModule,
    FileUploadModule,
    MaterialModule,
    NgxSpinnerModule
  ]
})
export class SharedModule { }
