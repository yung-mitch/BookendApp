import { Component, OnInit } from '@angular/core';
import { PhotoEditorModalComponent } from '../photo-editor-modal/photo-editor-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  user: User | undefined
  bsModalRefReplacePhoto: BsModalRef<PhotoEditorModalComponent> = new BsModalRef<PhotoEditorModalComponent>();

  constructor(private accountService: AccountService, private modalService: BsModalService, private toastr: ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user
      }
    })
  }

  ngOnInit(): void {
    
  }

  openPhotoEditorModal(user: User) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        user: this.user
      }
    }
    this.bsModalRefReplacePhoto = this.modalService.show(PhotoEditorModalComponent, config);
    this.bsModalRefReplacePhoto.onHide?.subscribe({
      next: () => {
        const photoUrl = this.bsModalRefReplacePhoto.content?.user?.photoUrl;
        console.log(photoUrl);
        if (photoUrl && this.user) {
          this.user.photoUrl = photoUrl;
          this.accountService.setCurrentUser(this.user);
          this.toastr.success('Success! You new profile photo has been saved');
        }
      }
    })
  }

  // updateUserPhoto(photoUrl: any) {
  //   if (this.user) {
  //     console.log(photoUrl);
  //     this.user.photoUrl = photoUrl;
  //     this.accountService.setCurrentUser(this.user);
  //   }
  // }
}
