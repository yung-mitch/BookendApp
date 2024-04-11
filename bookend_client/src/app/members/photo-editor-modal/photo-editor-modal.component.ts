import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor-modal',
  templateUrl: './photo-editor-modal.component.html',
  styleUrls: ['./photo-editor-modal.component.css']
})
export class PhotoEditorModalComponent implements OnInit {
  @Input() member: Member | undefined;
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  dropZoneDisabled = false;
  baseUrl = environment.apiUrl;
  user: User | undefined;
  
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
    const acceptableMedia = ['image/png', 'image/jpg', 'image/jpeg'];
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
      url: this.baseUrl + 'users/replace-photo',
      authToken: 'Bearer ' + this.user?.token,
      isHTML5: true,
      allowedFileType: ['image'],
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
      if (this.uploader) {
        // this.uploader.onBuildItemForm = (fileItem: FileItem, form: any) => {
          
        // }
        this.uploader.uploadAll();
        this.uploader.onSuccessItem = (item, response, status, header) => {
          if (response && this.user) {
            console.log(response);
            this.user.photoUrl = response;
          }
        }
        this.bsModalRef.hide();
      }
    } catch (error) {
      console.log(error);
    }
  }
}
