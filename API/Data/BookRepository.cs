using API.Chapters;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class BookRepository : IBookRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public BookRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public void AddBook(Book book)
        {
            _context.Books.Add(book);
        }

        public void DeleteBook(Book book)
        {
            _context.Books.Remove(book);
        }

        public void AddBookToLibrary(int userId, int bookId)
        {
            _context.UserBooks.Add(new UserBook
            {
                UserId = userId,
                BookId = bookId
            });
        }

        public void DeleteUserBook(UserBook userBook)
        {
            _context.UserBooks.Remove(userBook);
        }

        public async Task<UserBook> GetUserBook(int userId, int bookId)
        {
            return await _context.UserBooks.FindAsync(userId, bookId);
        }

        public async Task<BookDto> GetBookAsync(int id)
        {
            return await _context.Books
                .Where(x => x.Id == id)
                .ProjectTo<BookDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<Book> GetBookByIdAsync(int id)
        {
            return await _context.Books.FindAsync(id);
        }

        public async Task<IEnumerable<Book>> GetBooksAsync()
        {
            return await _context.Books.ToListAsync();
        }
        
        public async Task<IEnumerable<BookDto>> GetBooksAsync(int userId)
        {
            return await _context.Books
                .Where(x => x.PublishingUserId == userId)
                .ProjectTo<BookDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<List<BookDto>> GetLibraryBooks(int userId)
        {
            var userLibrary = _context.UserBooks.AsQueryable();
            var books = _context.Books.OrderBy(b => b.Title).AsQueryable();

            userLibrary = userLibrary.Where(ub => ub.UserId == userId);
            books = userLibrary.Select(libBook => libBook.Book);

            var userLibBooks = await books.ProjectTo<BookDto>(_mapper.ConfigurationProvider).ToListAsync();

            return userLibBooks;
        }

        public async Task<FullBookDto> GetFullBookAsync(int id)
        {
            return await _context.Books
                .Include(c => c.Chapters)
                .ProjectTo<FullBookDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Chapter> GetChapterAsync(int id)
        {
            return await _context.Chapters.FindAsync(id);
        }

        public async Task<ChapterDto> GetChapterDtoAsync(int id)
        {
            return await _context.Chapters
                .Where(x => x.Id == id)
                .ProjectTo<ChapterDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<List<ReviewDto>> GetBookReviews(int bookId)
        {
            var users = _context.Users;
            var reviews = _context.Reviews;

            var query = users
                .Join(
                    reviews.Where(x => x.BookId == bookId),
                    user => user.Id,
                    review => review.ReviewingUserId,
                    (user, review) => new ReviewDto
                    {
                        Id = review.Id,
                        Rating = review.Rating,
                        ReviewText = review.ReviewText,
                        ReviewingUserId = review.ReviewingUserId,
                        ReviewingUserName = user.UserName,
                        ReviewingUserPhotoUrl = user.ProfilePhoto.Url
                    }
                );

            var returnedReviews = await query.ToListAsync();

            return returnedReviews;
        }

        public void AddReview(Review review)
        {
            _context.Reviews.Add(review);
        }

        public void DeleteReview(Review review)
        {
            _context.Reviews.Remove(review);
        }

        public async Task<List<CommentDto>> GetChapterComments(int chapterId)
        {
            var users = _context.Users;
            var comments = _context.Comments;

            var query = users
                .Join(
                    comments.Where(x => x.ChapterId == chapterId),
                    user => user.Id,
                    comment => comment.CommentingUserId,
                    (user, comment) => new CommentDto
                    {
                        Id = comment.Id,
                        Timestamp = comment.Timestamp,
                        CommentText = comment.CommentText,
                        CommentingUserId = comment.CommentingUserId,
                        CommentingUserName = user.UserName
                    }
                );

            var returnedComments = await query.ToListAsync();
            
            return returnedComments;
        }

        public void AddComment(Comment comment)
        {
            _context.Comments.Add(comment);
        }

        public void DeleteComment(Comment comment)
        {
            _context.Comments.Remove(comment);
        }

        public async Task<Review> GetReviewByIdAsync(int reviewId)
        {
            return await _context.Reviews.FindAsync(reviewId);
        }

        public async Task<Comment> GetCommentByIdAsync(int commentId)
        {
            return await _context.Comments.FindAsync(commentId);
        }
    }
}
