import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { take } from 'rxjs';
import { Review } from 'src/app/_models/review';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { BookService } from 'src/app/_services/book.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit{
  @Input() review: Review | undefined;
  user: User | null = null;
  editReviewForm = false;
  model: any = {}
  @Output() reviewDeletedEvent = new EventEmitter<number>();

  constructor(private accountService: AccountService, private bookService: BookService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
  }

  ngOnInit(): void {
  }

  toggleEditReviewForm() {
    this.editReviewForm = !this.editReviewForm;
  }

  updateReview() {
    if (this.review)
    {
      console.log(this.model);
      this.bookService.updateBookReview(this.review.id, this.model).subscribe({
        next: () => {
          this.review!.rating = this.model.rating;
          this.review!.reviewText = this.model.reviewText;
          this.model = {};
        }
      })
    }
    this.toggleEditReviewForm();
  }

  deleteReview() {
    if (this.review)
    {
      this.bookService.deleteBookReview(this.review.id).subscribe({
        next: () => {
          this.reviewDeletedEvent.emit(this.review?.id);
        },
        error: error => {
          console.log(error);
        }
      })
    }
  }
}
