using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UserRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<MemberDto> GetMemberAsync(string username)
        {
            return await _context.Users
                .Where(x => x.UserName == username)
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
                .Include(p => p.ProfilePhoto)
                .SingleOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<PagedList<MemberDto>> GetUsersAsync(UserParams userParams)
        {
            var query = _context.Users
                .Include(p => p.ProfilePhoto)
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .OrderBy(x => x.UserName)
                .AsNoTracking();

            return await PagedList<MemberDto>.CreateAsync(query, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<PagedList<MemberDto>> GetUsersSearchAsync(UserParams userParams)
        {
            var query = _context.Users
                .Where(u => u.UserName.Contains(userParams.SearchString))
                .Include(p => p.ProfilePhoto)
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .OrderBy(u => u.UserName)
                .AsNoTracking();

            return await PagedList<MemberDto>.CreateAsync(query, userParams.PageNumber, userParams.PageSize);
        }
    }
}
