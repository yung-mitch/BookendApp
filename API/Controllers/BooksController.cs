using API.Chapters;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers
{
    [Authorize]
    public class BooksController : BaseApiController
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        private readonly IChapterService _chapterService;

        public BooksController(IUnitOfWork uow, IMapper mapper, IChapterService chapterService)
        {
            _uow = uow;
            _mapper = mapper;
            _chapterService = chapterService;
        }

        /*
            Get many books
            Parameters: None
        */
        [Authorize(Roles = "AppMember")]
        [HttpGet] // /api/books
        public async Task<ActionResult<IEnumerable<BookDto>>> GetBooks()
        {
            var books = await _uow.BookRepository.GetBooksAsync();

            return Ok(books);
        }

        /*
            Get books published by requesting user
            Parameters: None
            Request body content: None
            Query string variables: none
        */
        [Authorize (Roles = "Publisher")]
        [HttpGet("published")]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetPublishedBooks()
        {
            var user = await _uow.UserRepository.GetUserByIdAsync(User.GetUserId());

            if (user == null) return NotFound();

            var books = await _uow.BookRepository.GetBooksAsync(user.Id);

            if (books == null) return NotFound();

            return Ok(books);
        }

        /*
            Get one specific book
            Parameters: PK of Book the user is attempting to get
        */
        [Authorize (Roles = "AppMember, Publisher")]
        [HttpGet("{bookId}")]
        public async Task<ActionResult<FullBookDto>> GetBook(int bookId)
        {
            return await _uow.BookRepository.GetFullBookAsync(bookId);
        }

        /*
            Create a new book
            Parameters: None
            Request body contents: BookDto
        */
        [Authorize (Roles = "Publisher")]
        [HttpPost("create-book")]
        public async Task<ActionResult<BookDto>> CreateBook(BookDto bookDto)
        {
            var publishingUser = _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            if (publishingUser == null) return NotFound();

            var book = _mapper.Map<Book>(bookDto);
            book.PublishingUserId = publishingUser.Result.Id;

            _uow.BookRepository.AddBook(book);

            if (await _uow.Complete()) return Ok(_mapper.Map<BookDto>(book));

            return BadRequest("Failed to create book");
        }

        /*
            Update an existing book's details
            Parameters: PK of Book the user is attempting to update
            Request body contents: BookUpdateDto
        */
        [Authorize (Roles = "Publisher")]
        [HttpPut("{bookId}")]
        public async Task<ActionResult> UpdateBook(BookUpdateDto bookUpdateDto, int bookId)
        {
            var book = await _uow.BookRepository.GetBookByIdAsync(bookId);

            if (book == null) return NotFound();

            var currentUser = _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            if (currentUser.Result.Id != book.PublishingUserId) return BadRequest("You cannot edit a book you did not publish");

            _mapper.Map(bookUpdateDto, book);

            if (await _uow.Complete()) return NoContent();

            return BadRequest("Failed to update book");
        }

        /*
            Delete a book
            Parameters: PK of Book the user is attempting to delete
        */
        [Authorize (Roles = "Publisher")]
        [HttpDelete("delete-book/{bookId}")]
        public async Task<ActionResult> DeleteBook(int bookId)
        {
            // do not allow delete unless all chapters are already deleted
            var book = await _uow.BookRepository.GetBookByIdAsync(bookId);

            if (book == null) return NotFound();

            var currentUser = _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            if (currentUser.Result.Id != book.PublishingUserId) return BadRequest("You cannot edit a book you did not publish");

            if (book.Chapters.Count > 0) return BadRequest("Cannot destroy book that still contains content");

            _uow.BookRepository.DeleteBook(book);

            if (await _uow.Complete()) return Ok();

            return BadRequest("Problem deleting the book");
        }

        /*
            Get an existing Chapter
            Parameters: PK of Chapter the user is attempting to GET
        */
        [Authorize (Roles = "AppMember, Publisher")]
        [HttpGet("chapter/{chapterId}")]
        public async Task<ActionResult<ChapterDto>> GetChapterById(int chapterId)
        {
            // var chapter = await _uow.BookRepository.GetChapterAsync(chapterId);

            // if (chapter == null) return NotFound();

            return await _uow.BookRepository.GetChapterDtoAsync(chapterId);
        }

        /*
            Create a new chapter
            Parameters: PK of Book the user is attempting to add a chapter to
            Request body contents: File that contains the chapter audio file
            Query string variables: Title for the new chapter
        */
        [Authorize (Roles = "Publisher")]
        [HttpPost("add-chapter/{bookId}")]
        public async Task<ActionResult<ChapterDto>> AddChapter(IFormFile file, int bookId)
        {
            var chapterTitle = HttpContext.Request.Form["chapterTitle"];

            if (chapterTitle == "") return BadRequest("No Title input found");

            var book = await _uow.BookRepository.GetBookByIdAsync(bookId);

            if (book == null) return NotFound();

            var currentUser = _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            if (currentUser.Result.Id != book.PublishingUserId) return BadRequest("You cannot edit a book you did not publish");

            var result = await _chapterService.AddChapterAsync(file, book);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var chapter = new Chapter
            {
                ChapterTitle = chapterTitle,
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            book.Chapters.Add(chapter);

            if (await _uow.Complete())
            {
                return CreatedAtAction(nameof(GetBook), new {bookId = book.Id}, _mapper.Map<ChapterDto>(chapter));
            }

            return BadRequest("Problem adding chapter");
        }

        /*
            Update an existing chapter
            Parameters: PK of Chapter the user is attempting update
            Request body contents: ChapterUpdateDto
        */
        [Authorize (Roles = "Publisher")]
        [HttpPut("update-chapter/{chapterId}")]
        public async Task<ActionResult> UpdateChapter(ChapterUpdateDto chapterUpdateDto, int chapterId)
        {
            // derive user id from claims
            // chapterId comes from api request endpoint
            // derive bookId from chapter if it is found
                // 1. find chapter in db
                // 2. verify book publisher == current userId from claims
                // 3. update the chapter with contents of chapterUpdateDto

            var book = await _uow.BookRepository.GetBookByIdAsync(chapterUpdateDto.BookId);

            if (book == null) return NotFound();

            var chapter = await _uow.BookRepository.GetChapterAsync(chapterId);

            if (chapter == null) return NotFound();

            if (chapter.BookId != book.Id) return BadRequest("Chapter does not belong to book you are trying to access");

            var currentUser = _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            if (currentUser.Result.Id != book.PublishingUserId) return BadRequest("You cannot edit a book you did not publish");

            if (chapter.ChapterTitle == chapterUpdateDto.ChapterTitle) return BadRequest("No valid updates requested");

            chapter.ChapterTitle = chapterUpdateDto.ChapterTitle;

            if (await _uow.Complete()) return NoContent();

            return BadRequest("Problem updating chapter details");
        }

        /*
            Replace an existing Chapter's file with a new file
            Parameters: New file to store
            Request body contents: form-data {chapterId --> id of the Chapter to be manipulated, bookId --> id of the Book the Chapter belongs to}
        */
        [Authorize (Roles = "Publisher")]
        [HttpPost("replace-chapter-file")]
        public async Task<ActionResult> ReplaceChapterFile(IFormFile file)
        {
            var chapterIdString = HttpContext.Request.Form["chapterId"];
            var bookIdString = HttpContext.Request.Form["bookId"];

            if (String.IsNullOrEmpty(bookIdString) || String.IsNullOrEmpty(chapterIdString)) return BadRequest("Missing info in request");

            var bookId = int.Parse(bookIdString);
            var chapterId = int.Parse(chapterIdString);

            var book = await _uow.BookRepository.GetBookByIdAsync(bookId);

            if (book == null) return NotFound();

            var chapter = await _uow.BookRepository.GetChapterAsync(chapterId);

            if (chapter == null) return NotFound();

            if (chapter.BookId != book.Id) return BadRequest("Chapter does not belong to book you are attempting to access");

            var currentUser = _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            if (currentUser.Result.Id != book.PublishingUserId) return BadRequest("You cannot edit a book you did not publish");

            var replaceResult = await _chapterService.ReplaceChapterAsync(file, chapter.PublicId);

            if (replaceResult.Error != null) return BadRequest(replaceResult.Error.Message); // error on upload of new file, nothing changes in database

            chapter.Url = replaceResult.SecureUrl.AbsoluteUri;

            if (await _uow.Complete()) return NoContent();

            return BadRequest("Problem replacing chapter audio file");
        }

        /*
            Delete an existing chapter
            Parameters: PK of Chapter the user is attempting to delete
            Request body contents: BookId of the book the targeted chapter belongs to
        */
        [Authorize (Roles = "Publisher")]
        [HttpDelete("delete-chapter/{bookId}/{chapterId}")]
        public async Task<ActionResult> DeleteChapter(int chapterId, int bookId)
        {
            // derive user id from claims
            // chapterId comes from api request endpoint
            // derive bookId from chapter if it is found
                // 1. find chapter in db
                // 2. verify book publisher == current userId from claims
                // 3. delete chapter

            var book = await _uow.BookRepository.GetBookByIdAsync(bookId);

            if (book == null) return NotFound();

            var chapter = await _uow.BookRepository.GetChapterAsync(chapterId);

            if (chapter == null) return NotFound();

            if (chapter.BookId != book.Id) return BadRequest("Chapter does not belong to book you are trying to access");

            var currentUserId = User.GetUserId();

            if (currentUserId != book.PublishingUserId) return BadRequest("You cannot edit a book you did not publish");

            if (chapter.PublicId != null)
            {
                var result = await _chapterService.DeleteChapterAsync(chapter.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            book.Chapters.Remove(chapter);

            if (await _uow.Complete()) return Ok();

            return BadRequest("Problem deleting chapter");
        }

        /*
            Get reviews for the specified book
            Parameters: Id of targeted Book
            Request body content: None
            Query string variables: None
        */
        [Authorize (Roles = "AppMember")]
        [HttpGet("reviews/{bookId}")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetBookReviews(int bookId)
        {
            var book = await _uow.BookRepository.GetBookByIdAsync(bookId);
            if (book == null) return NotFound();

            var reviews = await _uow.BookRepository.GetBookReviews(bookId);
            if (reviews == null) return NotFound();

            return Ok(reviews);
        }

        /*
            Create review for the specified book
            Parameters: Id of targeted Book
            Request body content: ReviewDto object
            Query string variables: None
        */
        [Authorize (Roles = "AppMember")]
        [HttpPost("add-review/{bookId}")]
        public async Task<ActionResult<ReviewDto>> CreateReview(int bookId, ReviewDto reviewDto)
        {
            var book = await _uow.BookRepository.GetBookByIdAsync(bookId);
            if (book == null) return NotFound();

            var review = _mapper.Map<Review>(reviewDto);
            review.BookId = bookId;
            review.ReviewingUserId = User.GetUserId();
            _uow.BookRepository.AddReview(review);

            if (await _uow.Complete())
            {
                return CreatedAtAction(nameof(GetBook), new {bookId = book.Id}, _mapper.Map<ReviewDto>(review));
            }

            return BadRequest("Problem adding review");
        }

        /*
            Update review specified by Id
            Parameters: Id of Review to update
            Request body content:  Dto for updated review attributes
            Query string variables: None
        */
        [Authorize (Roles = "AppMember")]
        [HttpPut("update-review/{reviewId}")]
        public async Task<ActionResult> UpdateReview(ReviewUpdateDto reviewUpdateDto, int reviewId)
        {
            var review = await _uow.BookRepository.GetReviewByIdAsync(reviewId);
            if (review == null) return NotFound();

            var currentUser = await _uow.UserRepository.GetUserByIdAsync(User.GetUserId());
            if (currentUser.Id != review.ReviewingUserId) return BadRequest("You cannot edit a review you did not leave");

            _mapper.Map(reviewUpdateDto, review);

            if (await _uow.Complete()) return NoContent();

            return BadRequest("Failed to update review");
        }

        /*
            Delete Review specified by Id
            Parameters: Id of Review to be deleted
            Request body content: None
            Query string variables: None
        */
        [Authorize (Roles = "AppMember")]
        [HttpDelete("delete-review/{reviewId}")]
        public async Task<ActionResult> DeleteReview(int reviewId)
        {
            var review = await _uow.BookRepository.GetReviewByIdAsync(reviewId);
            if (review == null) return NotFound();

            var currentUser = await _uow.UserRepository.GetUserByIdAsync(User.GetUserId());
            if (currentUser.Id != review.ReviewingUserId) return BadRequest("You cannot edit a review you did not leave");

            _uow.BookRepository.DeleteReview(review);

            if (await _uow.Complete()) return Ok();

            return BadRequest("Problem deleting the review");
        }

        /*
            Get comments for the specified chapter
            Parameters: Id of targeted Chapter
            Request body content: None
            Query string variables: None
        */
        [Authorize (Roles = "AppMember")]
        [HttpGet("comments/{chapterId}")]
        public async Task<ActionResult<IEnumerable<CommentDto>>> GetChapterComments(int chapterId)
        {
            var chapter = await _uow.BookRepository.GetChapterAsync(chapterId);
            if (chapter == null) return NotFound();
            
            var comments = await _uow.BookRepository.GetChapterComments(chapterId);
            if (comments == null) return NotFound();

            return Ok(comments);
        }

        /*
            Create comment for the specified Chapter
            Parameters: Id of targeted Chapter
            Request body content: CommentDto object
            Query string variables: None
        */
        [Authorize (Roles = "AppMember")]
        [HttpPost("add-comment/{chapterId}")]
        public async Task<ActionResult<CommentDto>> CreateComment(int chapterId, CommentDto commentDto)
        {
            var chapter = await _uow.BookRepository.GetChapterAsync(chapterId);
            if (chapter == null) return NotFound();

            var comment = _mapper.Map<Comment>(commentDto);
            comment.ChapterId = chapterId;
            comment.CommentingUserId = User.GetUserId();
            _uow.BookRepository.AddComment(comment);

            if (await _uow.Complete())
            {
                return CreatedAtAction(nameof(GetChapterById), new {chapterId = chapter.Id}, _mapper.Map<CommentDto>(comment));
            }

            return BadRequest("Problem adding comment");
        }

        /*
            Update Comment specified by Id
            Parameters: Id of Comment to update
            Request body content: Dto for updated comment attributes
            Query string variables: None
        */
        [Authorize (Roles = "AppMember")]
        [HttpPut("update-comment/{commentId}")]
        public async Task<ActionResult> UpdateComment(CommentUpdateDto commentUpdateDto, int commentId)
        {
            var comment = await _uow.BookRepository.GetCommentByIdAsync(commentId);
            if (comment == null) return NotFound();

            var currentUser = await _uow.UserRepository.GetUserByIdAsync(User.GetUserId());
            if (currentUser.Id != comment.CommentingUserId) return BadRequest("You cannot edit a comment you did not leave");

            _mapper.Map(commentUpdateDto, comment);
            
            if (await _uow.Complete()) return NoContent();

            return BadRequest("Failed to update comment");
        }

        /*
           Delete Comment specified by Id
            Parameters: Id of Comment to be deleted
            Request body content: None
            Query string variables: None
        */
        [Authorize (Roles = "AppMember")]
        [HttpDelete("delete-comment/{commentId}")]
        public async Task<ActionResult> DeleteComment(int commentId)
        {
            var comment = await _uow.BookRepository.GetCommentByIdAsync(commentId);
            if (comment == null) return NotFound();
            
            var currentUser = await _uow.UserRepository.GetUserByIdAsync(User.GetUserId());
            if (currentUser.Id != comment.CommentingUserId) return BadRequest("You cannot edit a comment you did not leave");

            _uow.BookRepository.DeleteComment(comment);

            if (await _uow.Complete()) return Ok();

            return BadRequest("Problem deleting the comment");
        }
    }
}