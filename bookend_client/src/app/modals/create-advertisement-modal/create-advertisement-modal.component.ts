import { Component, OnInit } from '@angular/core';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { take } from 'rxjs';
import { Advertisement } from 'src/app/_models/advertisement';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-advertisement-modal',
  templateUrl: './create-advertisement-modal.component.html',
  styleUrls: ['./create-advertisement-modal.component.css']
})
export class CreateAdvertisementModalComponent implements OnInit {
  adName: string = '';
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  dropZoneDisabled = false;
  baseUrl = environment.apiUrl;
  user: User | undefined;
  advertisement: Advertisement | undefined;

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
      url: this.baseUrl + 'advertisements/add-advertisement',
      authToken: 'Bearer ' + this.user?.token,
      isHTML5: true,
      allowedFileType: ['audio'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 2 * 1024 * 1024 // 2MB --> can change later
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false
    }
  }

  submit() {
    try {
      if (this.uploader) {
        this.uploader.onBuildItemForm = (fileItem: FileItem, form: any) => {
          form.append('adName', this.adName)
        };
        this.uploader.uploadAll();
        this.uploader.onSuccessItem = (item, response, status, header) => {
          if (response) {
            this.advertisement = JSON.parse(response);
            console.log(this.advertisement);
          }
        }
        this.bsModalRef.hide();
      }
    } catch (error) {
      console.log(error);
    }
  }
}
