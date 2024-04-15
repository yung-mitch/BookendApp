using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        private readonly ITokenService _tokenService;

        public AccountController(UserManager<AppUser> userManager, IMapper mapper, ITokenService tokenService)
        {
            _userManager = userManager;
            _mapper = mapper;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            // check if user exists or if email is taken by existing user --> return badrequest if username already taken
            if (await UserExists(registerDto.Username)) return BadRequest("Username already exists");
            if (await EmailInUse(registerDto.Email)) return BadRequest("Email already taken");

            // create the user with the usermanager
            var user = _mapper.Map<AppUser>(registerDto);
            
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            // Add a default role

            var roleResult = await _userManager.AddToRoleAsync(user, "AppMember");

            if (!roleResult.Succeeded) return BadRequest(result.Errors);

            // if all steps succeeded, return UserDto

            return new UserDto
            {
                UserName = user.UserName,
                Token = await _tokenService.CreateToken(user)
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            // find user --> return unauthorized if user does not exist
            var user = await _userManager.Users
                .Include(p => p.ProfilePhoto)
                .SingleOrDefaultAsync(appUser => appUser.UserName == loginDto.Username);

            if (user == null) return Unauthorized("Invalid Username or Password"); // keep ambiguous for which parameter is not correct

            // Authenticate password with has stored in database
            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (!result) return Unauthorized("Invalid Username or Password");

            // if all steps succeeded, return UserDto
            return new UserDto
            {
                UserName = user.UserName,
                Token = await _tokenService.CreateToken(user),
                PhotoUrl = user.ProfilePhoto.Url
            };
        }

        private async Task<bool> UserExists(string username)
        {
            return await _userManager.Users.AnyAsync(appUser => appUser.UserName == username);
        }

        private async Task<bool> EmailInUse(string email)
        {
            return await _userManager.Users.AnyAsync(appUser => appUser.Email == email);
        }
    }
}
