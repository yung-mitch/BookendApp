using API.DTOs;
using API.Entities;
using API.Helpers;
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

        public async Task<PagedList<BookDto>> GetBookClubBooksAsync(int clubId, BookParams bookParams)
        {
            var query = _context.BookClubBooks
                .Where(cb => cb.ClubId == clubId)
                .Select(cb => cb.Book)
                .OrderBy(b => b.Title)
                .ProjectTo<BookDto>(_mapper.ConfigurationProvider)
                .AsNoTracking();

            return await PagedList<BookDto>.CreateAsync(query, bookParams.PageNumber, bookParams.PageSize);
        }

        public async Task<PagedList<MemberDto>> GetBookClubMembersAsync(int clubId, UserParams userParams)
        {
            var query = _context.UserClubs
                .Where(uc => uc.BookClubId == clubId)
                .Select(uc => uc.User)
                .OrderBy(u => u.UserName)
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .AsNoTracking();

            return await PagedList<MemberDto>.CreateAsync(query, userParams.PageNumber, userParams.PageSize);
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
