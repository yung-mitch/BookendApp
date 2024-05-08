using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUnitOfWork _uow;
        private readonly IPhotoService _photoService;

        public UsersController(IUnitOfWork uow, IPhotoService photoService)
        {
            _uow = uow;
            _photoService = photoService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
        {
            if (string.IsNullOrEmpty(userParams.SearchString))
            {
                var users = await _uow.UserRepository.GetUsersAsync(userParams);

                Response.AddPaginationHeader(new PaginationHeader(
                    users.CurrentPage,
                    users.PageSize,
                    users.TotalCount,
                    users.TotalPages
                ));

                return Ok(users);
            } else {
                // Get only Users that satisfy userParams.SearchString
                var users = await _uow.UserRepository.GetUsersSearchAsync(userParams);

                Response.AddPaginationHeader(new PaginationHeader(
                    users.CurrentPage,
                    users.PageSize,
                    users.TotalCount,
                    users.TotalPages
                ));

                return Ok(users);
            }
        }

        [HttpGet("{userName}")]
        public async Task<ActionResult<MemberDto>> GetUserByUsername(string userName)
        {
            return await _uow.UserRepository.GetMemberAsync(userName);
        }

        [HttpPost("replace-photo")]
        public async Task<ActionResult<string>> UpdatePhoto(IFormFile file)
        {
            var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
            if (user == null) return NotFound();

            var result = await _photoService.ReplacePhotoAsync(file, user.ProfilePhoto.PublicId);
            if (result.Error != null) return BadRequest(result.Error.Message); // error on upload of new file, nothing changes in database

            user.ProfilePhoto.Url = result.SecureUrl.AbsoluteUri;
            user.ProfilePhoto.PublicId = result.PublicId;

            if (await _uow.Complete()) return user.ProfilePhoto.Url;

            return BadRequest("Problem replacing user photo");
        }
    }
}