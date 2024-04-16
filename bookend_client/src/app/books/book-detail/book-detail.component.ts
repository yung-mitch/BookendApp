import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Book } from 'src/app/_models/book';
import { Chapter } from 'src/app/_models/chapter';
import { BookService } from 'src/app/_services/book.service';
import { ChapterEditModalComponent } from 'src/app/modals/chapter-edit-modal/chapter-edit-modal.component';
import { ChapterReplaceFileModalComponent } from 'src/app/modals/chapter-replace-file-modal/chapter-replace-file-modal.component';
import { CreateChapterModalComponent } from 'src/app/modals/create-chapter-modal/create-chapter-modal.component';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  book: Book | undefined;
  chapters: Chapter[] = [];
  bsModalRefCreateChapter: BsModalRef<CreateChapterModalComponent> = new BsModalRef<CreateChapterModalComponent>();
  bsModalRefChapterEdit: BsModalRef<ChapterEditModalComponent> = new BsModalRef<ChapterEditModalComponent>();
  bsModalRefReplaceChapter: BsModalRef<ChapterReplaceFileModalComponent> = new BsModalRef<ChapterReplaceFileModalComponent>();

  constructor(private bookService: BookService, private modalService: BsModalService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => this.book = data["book"]
    })

    console.log(this.book)
    this.loadChapters()
  }

  loadChapters() {
    if (!this.book) return;
    for (const chapter of this.book.chapters) {
      this.chapters.push(chapter);
    }
  }

  openCreateChapterModal(book: Book) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        book: this.book
      }
    }
    this.bsModalRefCreateChapter = this.modalService.show(CreateChapterModalComponent, config);
    this.bsModalRefCreateChapter.onHide?.subscribe({
      next: () => {
        const newChapter = this.bsModalRefCreateChapter.content?.chapter;
        if (newChapter) this.chapters.push(newChapter);
        // update chapters list --> will require changing loadChapters() method to make sure the addition is respecting the existing list and not adding existing chapters a second time
        console.log(newChapter);
        // const title = this.bsModalRefCreateChapter.content?.title;
        // const newChapter = this.bsModalRefCreateChapter.content?.chapter;

        // if (title && newChapter && this.book) {
        //   const addChapter = {
        //     chapterTitle: title,
        //     url: newChapter.url
        //   }
        //   this.bookService.addChapter(this.book.id, addChapter).subscribe({
        //     next: response => {
        //       if (response) {
        //         var chapter = JSON.parse(JSON.stringify(response)) as Chapter
        //         this.chapters.push(chapter);
        //         console.log(this.chapters);
        //       }
        //     }
        //   })
        // }
      }
    })
  }

  openEditChapterModal(chapter: Chapter) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        book: this.book,
        title: chapter.chapterTitle,
        chapterId: chapter.id
      }
    }
    this.bsModalRefChapterEdit = this.modalService.show(ChapterEditModalComponent, config);
    this.bsModalRefChapterEdit.onHide?.subscribe({
      next: () => {
        const chapterUpdate = {
          chapterTitle: this.bsModalRefChapterEdit.content?.model.title,
          bookId: this.book?.id
        }
        if (chapterUpdate.chapterTitle != this.book?.title && chapterUpdate.bookId == this.book?.id) {
          this.bookService.updateChapter(chapterUpdate, chapter.id).subscribe({
            next: () => {
              this.chapters[this.chapters.findIndex(x => x.id == chapter.id)].chapterTitle = chapterUpdate.chapterTitle;
            }
          })
        }
      }
    })
  }

  openChapterReplaceFileModal(chapter: Chapter) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        book: this.book,
        chapterId: chapter.id
      }
    }
    this.bsModalRefReplaceChapter = this.modalService.show(ChapterReplaceFileModalComponent, config);
    this.bsModalRefReplaceChapter.onHide?.subscribe({
      next: () => {
        // May need to call loadChapters() to refresh the list; requires logic in loadChapters to handle one chapter's update
      }
    })
  }

  delete(bookId: number, chapterId: number) {
    this.bookService.deleteChapter(bookId, chapterId).subscribe({
      next: () => {
        this.chapters = this.chapters.filter(x => x.id != chapterId);
      },
      error: error => {
        console.log(error);
      }
    })
  }
}
