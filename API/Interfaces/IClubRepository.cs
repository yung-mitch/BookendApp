using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IClubRepository
    {
        Task<IEnumerable<BookClub>> GetBookClubsAsync();
        Task<List<ClubDto>> GetUserBookClubsAsync(int userId);
        Task<PagedList<BookDto>> GetBookClubBooksAsync(int clubId, BookParams bookParams);
        Task<PagedList<MemberDto>> GetBookClubMembersAsync(int clubId, UserParams userParams);
        Task<ClubDto> GetBookClubByIdAsync(int clubId);
        Task<BookClub> GetBookClub(int clubId);
        Task<UserClub> GetUserClub(int userId, int clubId);
        Task<BookClubBook> GetBookClubBook(int bookId, int clubId);

        void AddBookClub(BookClub bookClub);
        void DeleteClub(BookClub bookClub);
        void AddMembersToBookClub(List<UserClub> membersToAdd);
        void AddMemberToBookClub(int userId, int clubId);
        void RemoveBookClubMember(UserClub userClub);
        void AddBookClubBook(int bookId, int clubId);
        void RemoveBookClubBook(BookClubBook bookClubBook);
    }
}
