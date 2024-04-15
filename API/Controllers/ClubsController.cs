using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class ClubsController : BaseApiController
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public ClubsController(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        /*
            Get all clubs the current user is a member of
            Parameters: None
            Request body content: None
            Query string variables: None
        */
        [Authorize(Roles = "AppMember")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClubDto>>> GetUserClubs()
        {
            var user = await _uow.UserRepository.GetUserByIdAsync(User.GetUserId());
            if (user == null) return NotFound();

            var clubs = await _uow.ClubRepository.GetUserBookClubsAsync(user.Id);

            return Ok(clubs);
        }

        /*
            Get the specified club
            Parameters: Id of the BookClub the user is requesting
            Request body content: None
            Query string variables: None
        */
        [Authorize(Roles = "AppMember")]
        [HttpGet("{clubId}")]
        public async Task<ActionResult<ClubDto>> GetClub(int clubId)
        {
            var user = await _uow.UserRepository.GetUserByIdAsync(User.GetUserId());
            if (user == null) return NotFound();

            var club = await _uow.ClubRepository.GetBookClub(clubId);
            if (club == null) return NotFound();
            
            var userClub = await _uow.ClubRepository.GetUserClub(user.Id, clubId);
            if (userClub == null) return BadRequest("You are not a member of the BookClub");

            return await _uow.ClubRepository.GetBookClubByIdAsync(clubId);
        }
        
        /*
            Create a new BookClub
            Parameters: None
            Request body content: ClubDto object needed to successfully create a BookClub
            Query string variables: None
        */
        [Authorize(Roles = "AppMember")]
        [HttpPost("create-club")]
        public async Task<ActionResult<ClubDto>> CreateBookClub(ClubDto clubDto)
        {
            var owner = await _uow.UserRepository.GetUserByIdAsync(User.GetUserId());
            if (owner == null) return NotFound();

            var club = _mapper.Map<BookClub>(clubDto);
            club.OwningUserId = owner.Id;

            _uow.ClubRepository.AddBookClub(club);
            if (await _uow.Complete()) {
                _uow.ClubRepository.AddMemberToBookClub(owner.Id, club.Id);
                if (await _uow.Complete()) return Ok(_mapper.Map<ClubDto>(club));
            }

            return BadRequest("Failed to create BookClub");
        }

        /*
            Update the specified BookClub
            Parameters: Id of the BookClub to update
            Request body content: ClubUpdateDto object needed to successfully update a BookClub
            Query string variables: None
        */
        [Authorize(Roles = "AppMember")]
        [HttpPut("update-club/{clubId}")]
        public async Task<ActionResult<ClubDto>> UpdateBookClub(ClubUpdateDto clubUpdateDto, int clubId)
        {
            var club = await _uow.ClubRepository.GetBookClub(clubId);
            if (club == null) return NotFound();

            var currentUser = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
            if (currentUser.Id != club.OwningUserId) return BadRequest("You cannot edit a BookClub you do not own");

            _mapper.Map(clubUpdateDto, club);
            if (await _uow.Complete()) return NoContent();

            return BadRequest("Failed to update BookClub");
        }

        /*
            Delete the specified BookClub
            Parameters: Id of the BookClub to delete
            Request body content: None
            Query string variables: None
        */
        [Authorize(Roles = "AppMember")]
        [HttpDelete("delete-club/{clubId}")]
        public async Task<ActionResult<ClubDto>> DeleteBookClub(int clubId)
        {
            var club = await _uow.ClubRepository.GetBookClub(clubId);
            if (club == null) return NotFound();

            var currentUser = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
            if (currentUser.Id != club.OwningUserId) return BadRequest("You cannot edit a BookClub you do now own");

            _uow.ClubRepository.DeleteClub(club);
            if (await _uow.Complete()) return Ok();

            return BadRequest("Problem deleting the BookClub");
        }

        /*
            Get the members of the specified BookClub
            Parameters: Id of the BookClub
            Request body content: None
            Query string variables: None
        */
        [Authorize(Roles = "AppMember")]
        [HttpGet("members/{clubId}")]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetClubMembers(int clubId)
        {
            var club = await _uow.ClubRepository.GetBookClub(clubId);
            if (club == null) return NotFound();

            var members = await _uow.ClubRepository.GetBookClubMembersAsync(clubId);

            return Ok(members);
        }

        /*
            Get
            Parameters: 
            Request body content: 
            Query string variables: 
        */
        // [Authorize(Roles = "AppMember")]
        // [HttpPost("{clubId}/add-members")]
        // public async Task<ActionResult<IEnumerable<MemberDto>>> AddClubMembers(int clubId, IEnumerable<int> newMembersList)
        // {
        //     var club = await _uow.ClubRepository.GetBookClub(clubId);
        //     if (club == null) return NotFound();
            
        // }

        /*
            Add a member to the specified BookClub by creating a new UserClub object
            Parameters: Id of the BookClub to add a member to
            Request body content: None
            Query string variables: Id of the User to add to the BookClub
        */
        [Authorize(Roles = "AppMember")]
        [HttpPost("add-member/{clubId}")]
        public async Task<ActionResult<IEnumerable<MemberDto>>> AddClubMember(int clubId, [FromQuery]int newMemberId)
        {
            var club = await _uow.ClubRepository.GetBookClub(clubId);
            if (club == null) return NotFound();

            var currentUser = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
            if (currentUser.Id != club.OwningUserId) return BadRequest("You cannot make changes to a BookClub you do not own");
            
            var newMember = await _uow.UserRepository.GetUserByIdAsync(newMemberId);
            if (newMember == null) return NotFound();
            
            var userClubFound = await _uow.ClubRepository.GetUserClub(newMemberId, clubId);
            if (userClubFound != null) return BadRequest("User is already a member of the BookClub");

            _uow.ClubRepository.AddMemberToBookClub(newMemberId, clubId);
            if (await _uow.Complete()) return NoContent();

            return BadRequest("Problem adding member to the BookClub");
        }

        /*
            Remove a member from the specified BookClub by deleting the appropriate UserClub entity
            Parameters: Id of the BookClub to remove the member from
            Request body content: None
            Query string variables: Id of the User to remove from the BookClub
        */
        [Authorize(Roles = "AppMember")]
        [HttpDelete("remove-member/{clubId}")]
        public async Task<ActionResult> RemoveClubMember([FromQuery]int userId, int clubId)
        {
            var club = await _uow.ClubRepository.GetBookClub(clubId);
            if (club == null) return NotFound();

            var currentUser = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
            if (currentUser.Id != club.OwningUserId) return BadRequest("You cannot make changes to a BookClub you do not own");

            var userClub = await _uow.ClubRepository.GetUserClub(userId, clubId);
            if (userClub == null) return NotFound();

            _uow.ClubRepository.RemoveBookClubMember(userClub);
            if (await _uow.Complete()) return NoContent();

            return BadRequest("Problem removing member from the BookClub");
        }

        /*
            Get the Books of the specified BookClub
            Parameters: Id of the BookClub to get the books of
            Request body content: None
            Query string variables: None
        */
        [Authorize(Roles = "AppMember")]
        [HttpGet("books/{clubId}")]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetClubBooks(int clubId)
        {
            var club = await _uow.ClubRepository.GetBookClub(clubId);
            if (club == null) return NotFound();

            var books = await _uow.ClubRepository.GetBookClubBooksAsync(clubId);

            return Ok(books);
        }

        /*
            Add a Book to the specified BookClub by creating a BookClubBook object
            Parameters: Id of the BookClub to add a Book to
            Request body content: None
            Query string variables: Id of the Book to add to the BookClub
        */
        [Authorize(Roles = "AppMember")]
        [HttpPost("add-book/{clubId}")]
        public async Task<ActionResult<BookDto>> AddClubBook([FromQuery]int bookId, int clubId)
        {
            var club = await _uow.ClubRepository.GetBookClub(clubId);
            if (club == null) return NotFound();

            var currentUser = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
            if (currentUser.Id != club.OwningUserId) return BadRequest("You cannot add books to a BookClub you do not own");

            var book = await _uow.BookRepository.GetBookByIdAsync(bookId);
            if (book == null) return NotFound();

            var clubBookFound = await _uow.ClubRepository.GetBookClubBook(bookId, clubId);
            if (clubBookFound != null) return BadRequest("This book is already added to the BookClub");

            _uow.ClubRepository.AddBookClubBook(bookId, clubId);
            if (await _uow.Complete()) return Ok(bookId);

            return BadRequest("Failed to add book to BookClub");
        }

        /*
            Remove a book from the specified BookClub by deleting the appropriate BookClubBook entity
            Parameters: Id of the BookClub to remove the Book from
            Request body content: None
            Query string variables: Id of the Book to remove from the BookClub
        */
        [Authorize(Roles = "AppMember")]
        [HttpDelete("remove-book/{clubId}")]
        public async Task<ActionResult> RemoveClubBook([FromQuery]int bookId, int clubId)
        {
            var club = await _uow.ClubRepository.GetBookClub(clubId);
            if (club == null) return NotFound();

            var currentUser = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
            if (currentUser.Id != club.OwningUserId) return BadRequest("You cannot add books to a BookClub you do not own");
            
            var clubBook = await _uow.ClubRepository.GetBookClubBook(bookId, clubId);
            if (clubBook == null) return NotFound();

            _uow.ClubRepository.RemoveBookClubBook(clubBook);
            if (await _uow.Complete()) return NoContent();

            return BadRequest("Problem removing book from the BookClub");
        }

        /*
            Get the value of if the specified Book is already added to the specified BookClub
            Parameters: Id of the BookClub; Id of the Book
            Request body content: None
            Query string variables: None
        */
        [Authorize(Roles = "AppMember")]
        [HttpGet("books/{clubId}/{bookId}")]
        public async Task<ActionResult<Boolean>> FoundInBookClubBooks(int bookId, int clubId)
        {
            var clubBook = await _uow.ClubRepository.GetBookClubBook(bookId, clubId);
            return clubBook != null;
        }
    }
}
