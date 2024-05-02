import { Component, OnInit } from '@angular/core';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-advertisement-replace-file-modal',
  templateUrl: './advertisement-replace-file-modal.component.html',
  styleUrls: ['./advertisement-replace-file-modal.component.css']
})
export class AdvertisementReplaceFileModalComponent implements OnInit {
  advertisementId: number | undefined;
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  dropZoneDisabled = false;
  baseUrl = environment.apiUrl;
  user: User | undefined;

  constructor(public bsModalRef: BsModalRef, private accountService: AccountService, private toastr: ToastrService) {
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
        this.toastr.error('Invalid filetype. Please use .wav or .mp3');
      }
    }
  }

  toggleDropZone() {
    this.dropZoneDisabled = !this.dropZoneDisabled;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'advertisements/replace-advertisement-file',
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
      if(this.uploader) {
        this.uploader.onBuildItemForm = (fileItem: FileItem, form: any) => {
          form.append('advertisementId', this.advertisementId)
        }
        this.uploader.uploadAll();
        this.uploader.onSuccessItem = (item, response, status, header) => {
          if (response) {
            console.log(response);
            this.toastr.success('Success! File change saved for Advertisement');
          }
        }
        this.bsModalRef.hide();
      }
    } catch (error) {
      console.log(error);
      this.toastr.error('Something went wrong when attempting to replace the audio file\n\n' + error);
    }
  }
}
