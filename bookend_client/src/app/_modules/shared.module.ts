import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FileUploadModule } from 'ng2-file-upload';
import { MaterialModule } from './material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccordionModule } from 'ngx-bootstrap/accordion';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    FileUploadModule,
    MaterialModule,
    NgxSpinnerModule.forRoot({ type: 'line-scale-pulse-out' }),
    ToastrModule.forRoot({positionClass: 'toast-center-center'}),
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
  ],
  exports: [
    BsDropdownModule,
    ModalModule,
    FileUploadModule,
    MaterialModule,
    NgxSpinnerModule,
    ToastrModule,
    PaginationModule,
    TabsModule,
    AccordionModule,
  ]
})
export class SharedModule { }
