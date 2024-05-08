using API.Chapters;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IBookRepository
    {
        Task<PagedList<BookDto>> GetBooksAsync(BookParams bookParams);
        Task<PagedList<BookDto>> GetBooksSearchAsync(BookParams bookParams);
        Task<PagedList<BookDto>> GetBooksAsync(int userId, BookParams bookParams);
        Task<PagedList<BookDto>> GetLibraryBooks(int userId, BookParams bookParams);
        Task<UserBook> GetUserBook(int userId, int bookId);
        Task<Book> GetBookByIdAsync(int id);
        Task<Book> GetBookWithChaptersAsync(int id);
        Task<BookDto> GetBookAsync(int id);
        Task<FullBookDto> GetFullBookAsync(int id);
        Task<Chapter> GetChapterAsync(int id);
        Task<ChapterDto> GetChapterDtoAsync(int id);
        Task<List<ReviewDto>> GetBookReviews(int bookId);
        Task<Review> GetReviewByIdAsync(int reviewId);
        Task<List<CommentDto>> GetChapterComments(int chapterId);
        Task<Comment> GetCommentByIdAsync(int commentId);
        
        void AddBook(Book book);
        void DeleteBook(Book book);

        void AddBookToLibrary(int userId, int bookId);
        void DeleteUserBook(UserBook userBook);
        void AddReview(Review review);
        void DeleteReview(Review review);
        void AddComment(Comment comment);
        void DeleteComment(Comment comment);
    }
}
