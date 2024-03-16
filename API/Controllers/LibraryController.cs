using API.DTOs;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class LibraryController : BaseApiController
    {
        private readonly IUnitOfWork _uow;

        public LibraryController(IUnitOfWork uow)
        {
            _uow = uow;
        }

        /*
            Get the books that the requesting user has previously added to their UserLibrary
            Parameters: None
            Request body content: None
            Query string variables: None
        */
        [Authorize(Roles = "AppMember")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetUserLibrary()
        {
            var user = await _uow.UserRepository.GetUserByIdAsync(User.GetUserId());

            if (user == null) return NotFound();

            var books = await _uow.BookRepository.GetLibraryBooks(user.Id);

            return Ok(books);
        }

        /*
            Add an existing book to the requesting user's UserLibrary
            Parameters: Id of the book the user wants to add to their UserLibrary
            Request body content: None
            Query string variables: None
        */
        [Authorize(Roles = "AppMember")]
        [HttpPost("add/")]
        public async Task<ActionResult> AddBookToLibrary([FromQuery]int bookId)
        {
            var user = await _uow.UserRepository.GetUserByIdAsync(User.GetUserId());

            if (user == null) return NotFound();

            _uow.BookRepository.AddBookToLibrary(user.Id, bookId);

            if (await _uow.Complete()) return Ok(bookId);

            return BadRequest("Failed to add book to library");
        }
    }
}
