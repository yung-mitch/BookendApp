using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;

        public UsersController(IUserRepository userRepository)
        {
            this._userRepository = userRepository;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IEnumerable<AppUser>> GetUsers()
        {
            return await _userRepository.GetUsersAsync();
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUserByUsername(string username)
        {
            return await _userRepository.GetMemberAsync(username);
        }
    }
}