import { Component, Input, OnInit } from '@angular/core';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { take } from 'rxjs';
import { Book } from 'src/app/_models/book';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chapter-replace-file-modal',
  templateUrl: './chapter-replace-file-modal.component.html',
  styleUrls: ['./chapter-replace-file-modal.component.css']
})
export class ChapterReplaceFileModalComponent implements OnInit {
  @Input() book: Book | undefined;
  bookId: number | undefined;
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  dropZoneDisabled = false;
  baseUrl = environment.apiUrl;
  user: User | undefined;
  chapterId: number | undefined;

  constructor(public bsModalRef: BsModalRef, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user
      }
    })
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  getFileType(e: any) {
    const acceptableMedia = ['audio/wav', 'audio/mpeg']
    const fileList = e;
    if (fileList) {
      const fileType = fileList[0].type;
      if (!acceptableMedia.includes(fileType)) {
        this.uploader?.cancelAll;
        this.toggleDropZone();
        console.log('Invalid filetype'); // will replace this with toast message
      }
    }
  }

  toggleDropZone() {
    this.dropZoneDisabled = !this.dropZoneDisabled;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'books/replace-chapter-file',
      authToken: 'Bearer ' + this.user?.token,
      isHTML5: true,
      allowedFileType: ['audio'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 5 * 1024 * 1024 // 5MB --> can change later
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false
    }
  }

  submit() {
    try {
      if(this.uploader) {
        this.uploader.onBuildItemForm = (fileItem: FileItem, form: any) => {
          form.append('chapterId', this.chapterId),
          form.append('bookId', this.book?.id)
        }
        this.uploader.uploadAll();
        this.uploader.onSuccessItem = (item, response, status, header) => {
          if (response) {
            console.log(response);
          }
        }
        this.bsModalRef.hide();
      }
    } catch (error) {
      console.log(error);
    }
  }
}
