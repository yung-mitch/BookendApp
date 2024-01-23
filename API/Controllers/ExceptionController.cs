using System.Security.Cryptography.X509Certificates;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ExceptionController : BaseApiController
    {
        private readonly DataContext _context;

        public ExceptionController(DataContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("auth")]
        public ActionResult<string> GetAuth()
        {
            return "Authentication passed if seeing this message";
        }

        [HttpGet("not-found")]
        public ActionResult<AppUser> GetNotFound()
        {
            var user = _context.Users.Find(-1); // force server error
            if (user == null) return NotFound(); // since user is not found, return NotFound()

            return user;
        }

        [HttpGet("server-error")]
        public ActionResult<string> GetServerError()
        {
            var error = _context.Users.Find(-1); // force server error
            var errorToReturn = error.ToString(); // just return the server error

            return errorToReturn;
        }

        [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequest()
        {
            return BadRequest("This is a bad request"); // just return generic bad request error from API
        }

    }
}
