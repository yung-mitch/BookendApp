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

        public async Task<Book> GetFullBookAsync(int id)
        {
            return await _context.Books
                .Include(c => c.Chapters)
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
    }
}
