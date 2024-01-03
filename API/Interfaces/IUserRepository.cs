using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByUsernameAsync(string username);
        Task<MemberDto> GetMemberAsync(string username);
    }
}
