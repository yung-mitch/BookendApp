using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class ClubRepository : IClubRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ClubRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public void AddBookClub(BookClub bookClub)
        {
            _context.BookClubs.Add(bookClub);
        }

        public void AddBookClubBook(int bookId, int clubId)
        {
            _context.BookClubBooks.Add(new BookClubBook
            {
                ClubId = clubId,
                BookId = bookId
            });
        }

        public void AddMemberToBookClub(int userId, int clubId)
        {
            _context.UserClubs.Add(new UserClub
            {
                UserId = userId,
                BookClubId = clubId
            });
        }

        public void AddMembersToBookClub(List<UserClub> membersToAdd)
        {
            _context.UserClubs.AddRange(membersToAdd);
        }

        public void DeleteClub(BookClub bookClub)
        {
            _context.BookClubs.Remove(bookClub);
        }

        public async Task<ClubDto> GetBookClubByIdAsync(int clubId)
        {
            return await _context.BookClubs
                .ProjectTo<ClubDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync(x => x.Id == clubId);
        }

        public async Task<BookClub> GetBookClub(int clubId)
        {
            return await _context.BookClubs.FindAsync(clubId);
        }

        public async Task<IEnumerable<BookClub>> GetBookClubsAsync()
        {
            return await _context.BookClubs.ToListAsync();
        }

        public async Task<List<ClubDto>> GetUserBookClubsAsync(int userId)
        {
            var userClubs = _context.UserClubs.AsQueryable();
            var clubs = _context.BookClubs.OrderBy(bc => bc.ClubName).AsQueryable();

            userClubs = userClubs.Where(uc => uc.UserId == userId);
            clubs = userClubs.Select(uClub => uClub.Club);

            var userClubObjs = await clubs.ProjectTo<ClubDto>(_mapper.ConfigurationProvider).ToListAsync();

            return userClubObjs;
        }

        public async Task<List<BookDto>> GetBookClubBooksAsync(int clubId)
        {
            var clubBooks = _context.BookClubBooks.AsQueryable();
            var books = _context.Books.OrderBy(b => b.Title).AsQueryable();

            clubBooks = clubBooks.Where(cb => cb.ClubId == clubId);
            books = clubBooks.Select(cb => cb.Book);

            var clubLibraryBooks = await books.ProjectTo<BookDto>(_mapper.ConfigurationProvider).ToListAsync();

            return clubLibraryBooks;
        }

        public async Task<List<MemberDto>> GetBookClubMembersAsync(int clubId)
        {
            var userClubs = _context.UserClubs.AsQueryable();
            var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();

            userClubs = userClubs.Where(uc => uc.BookClubId == clubId);
            users = userClubs.Select(uc => uc.User);

            var clubMembers = await users.ProjectTo<MemberDto>(_mapper.ConfigurationProvider).ToListAsync();

            return clubMembers;
        }

        public void RemoveBookClubBook(BookClubBook bookClubBook)
        {
            _context.BookClubBooks.Remove(bookClubBook);
        }

        public void RemoveBookClubMember(UserClub userClub)
        {
            _context.UserClubs.Remove(userClub);
        }

        public async Task<UserClub> GetUserClub(int userId, int clubId)
        {
            return await _context.UserClubs.FindAsync(clubId, userId);
        }

        public async Task<BookClubBook> GetBookClubBook(int bookId, int clubId)
        {
            return await _context.BookClubBooks.FindAsync(clubId, bookId);
        }
    }
}
