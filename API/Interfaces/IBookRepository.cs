using API.Chapters;
using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IBookRepository
    {
        Task<IEnumerable<Book>> GetBooksAsync();
        Task<Book> GetBookByIdAsync(int id);
        Task<BookDto> GetBookAsync(int id);
        Task<Book> GetFullBookAsync(int id);
        Task<Chapter> GetChapterAsync(int id);
        Task<ChapterDto> GetChapterDtoAsync(int id);
        
        void AddBook(Book book);
        void DeleteBook(Book book);
    }
}
