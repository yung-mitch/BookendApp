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
        [HttpPost("add")]
        public async Task<ActionResult> AddBookToLibrary([FromQuery]int bookId)
        {
            var user = await _uow.UserRepository.GetUserByIdAsync(User.GetUserId());

            if (user == null) return NotFound();

            var userBookFound = await _uow.BookRepository.GetUserBook(user.Id, bookId);

            if (userBookFound != null) return BadRequest("You already have this book added to your library");

            _uow.BookRepository.AddBookToLibrary(user.Id, bookId);

            if (await _uow.Complete()) return Ok(bookId);

            return BadRequest("Failed to add book to library");
        }

        [Authorize(Roles = "AppMember")]
        [HttpDelete("remove")]
        public async Task<ActionResult> RemoveBookFromLibrary([FromQuery]int bookId)
        {
            var user = await _uow.UserRepository.GetUserByIdAsync(User.GetUserId());

            if (user == null) return NotFound();

            var userBook = await _uow.BookRepository.GetUserBook(user.Id, bookId);

            if (userBook == null) return NotFound();

            _uow.BookRepository.DeleteUserBook(userBook);

            if (await _uow.Complete()) return NoContent();

            return BadRequest("Problem removing book from library");
        }

        [Authorize(Roles = "AppMember")]
        [HttpGet("{bookId}")]
        public async Task<ActionResult<Boolean>> FoundInUserLibrary(int bookId)
        {
            var user = await _uow.UserRepository.GetUserByIdAsync(User.GetUserId());

            if (user == null) return NotFound();

            var userBook = await _uow.BookRepository.GetUserBook(user.Id, bookId);

            return userBook != null;
        }
    }
}
