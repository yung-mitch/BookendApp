import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Book } from 'src/app/_models/book';
import { Review } from 'src/app/_models/review';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { BookService } from 'src/app/_services/book.service';

@Component({
  selector: 'app-reviews-list',
  templateUrl: './reviews-list.component.html',
  styleUrls: ['./reviews-list.component.css']
})
export class ReviewsListComponent implements OnInit {
  @Input() book: Book | undefined;
  reviews: Review[] = [];
  user: User | null = null;
  addReviewMode = false;
  model: any = {};

  constructor(private bookService: BookService, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
  }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews() {
    if (!this.book) return;
    this.bookService.getBookReviews(this.book.id).subscribe({
      next: response => {
        if (response)
        {
          this.reviews = response;
          console.log(this.reviews);
        }
      }
    })
  }

  toggleAddReviewForm() {
    this.addReviewMode = !this.addReviewMode;
  }

  createReview() {
    if (this.book) {
      console.log(this.model);
      this.bookService.createBookReview(this.book.id, this.model).subscribe({
        next: response => {
          if (response) {
            var review = JSON.parse(JSON.stringify(response)) as Review;
            if (this.user)
            {
              review.reviewingUserName = this.user.username;
              review.reviewingUserPhotoUrl = this.user.photoUrl;
            }
            this.reviews.push(review);
            console.log(this.reviews);
          }
        }
      })
    }
    this.toggleAddReviewForm();
  }

  updateReviewList(reviewId: number) {
    this.reviews = this.reviews.filter(x => x.id != reviewId);
  }
}
