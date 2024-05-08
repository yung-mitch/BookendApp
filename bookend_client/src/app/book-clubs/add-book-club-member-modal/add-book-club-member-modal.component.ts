import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { UserParams } from 'src/app/_models/userParams';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-add-book-club-member-modal',
  templateUrl: './add-book-club-member-modal.component.html',
  styleUrls: ['./add-book-club-member-modal.component.css']
})
export class AddBookClubMemberModalComponent implements OnInit {
  clubMembers: Member[] = [];
  otherMembers: Member[] = [];
  newMemberId: number | null = null;
  pagination: Pagination | undefined;
  userParams: UserParams | undefined;
  searchString: string = '';
  searched = false;

  constructor(private memberService: MemberService, private toastr: ToastrService, public bsModalRef: BsModalRef) {
    this.userParams = new UserParams();
  }

  ngOnInit(): void {
    // this.loadMembers();
  }

  loadMembers() {
    if (this.userParams) {
      this.memberService.getMembers(this.userParams).subscribe({
        next: response => {
          if (response.result && response.pagination) {
            if (response.result.length > 0) {
              this.otherMembers = response.result.filter(x => !this.clubMembers.includes(x));
              this.pagination = response.pagination;
              this.searched = true;
            } else {
              this.toastr.error('No members matched your search. Try searching for someone else.');
            }
          } else {
            this.toastr.error('Something went wrong when when performing your search. Try searching our library again.');
          }
        }
      })
    }
  }

  addNewMember() {
    if (this.newMemberId) {
      console.log(this.newMemberId);
      this.bsModalRef.hide();
    }
  }
  
  searchMembers() {
    if (this.userParams && this.searchString != '') {
      this.userParams.searchString = this.searchString;
      console.log(this.userParams.searchString);
      this.loadMembers();
    } else {
      this.toastr.error("Enter a valid search term");
    }
  }
  
  pageChanged(event: any) {
    if (this.userParams && this.userParams?.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.loadMembers();
    }
  }
}
