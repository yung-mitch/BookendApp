import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Member } from 'src/app/_models/member';
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

  constructor(private memberService: MemberService, public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers().subscribe({
      next: response => {
        if (response) {
          this.otherMembers = response.filter(x => !this.clubMembers.includes(x))
        }
      }
    })
  }

  addNewMember() {
    if (this.newMemberId) {
      console.log(this.newMemberId);
      this.bsModalRef.hide();
    }
  }
}
