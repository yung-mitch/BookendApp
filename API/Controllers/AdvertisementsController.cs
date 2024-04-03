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
    public class AdvertisementsController : BaseApiController
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        private readonly IAdvertisementService _adService;

        public AdvertisementsController(IUnitOfWork uow, IMapper mapper, IAdvertisementService adService)
        {
            _uow = uow;
            _mapper = mapper;
            _adService = adService;
        }

        /*
            Action: Get all Advertisements in the database
            Parameters: None
            Request body content: None
            Query String variables: None
        */
        [Authorize (Roles = "Admin")]
        [HttpGet] // /api/advertisements
        public async Task<ActionResult<IEnumerable<AdvertisementDto>>> GetAdvertisements()
        {
            var ads = await _uow.AdvertisementRepository.GetAdvertisementDtosAsync();

            return Ok(ads);
        }

        /*
            Action: Get all Advertisements published to the platform by the requesting user
            Parameters: None
            Request body content: None
            Query String variables: None
        */
        [Authorize (Roles = "Advertiser")]
        [HttpGet("published")] // /api/advertisements/published
        public async Task<ActionResult<IEnumerable<AdvertisementDto>>> GetPublishedAdvertisements()
        {
            var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            if (user == null) return NotFound();

            var ads = await _uow.AdvertisementRepository.GetUserAdvertisementsAsync(user.Id);

            if (ads == null) return NotFound();

            return Ok(ads);
        }

        /*
            Action: Get specific Advertisement with the Ad's Id
            Parameters: advertisementId of the Ad being requested
            Request body content: None
            Query String variables: None
        */
        [Authorize (Roles = "Advertiser")]
        [HttpGet("{advertisementId}")] // /api/advertisements/{advertisementId}
        public async Task<ActionResult<AdvertisementDto>> GetAdvertisement(int advertisementId)
        {
            return await _uow.AdvertisementRepository.GetAdvertisementAsync(advertisementId);
        } 

        /*
            Action: Create a new Advertisement
            Parameters: None
            Request body content: File that contains the Advertisement audio file, AdName string
            Query String variables: None
        */
        [Authorize (Roles = "Advertiser")]
        [HttpPost("add-advertisement")] // /api/advertisements/add-advertisement
        public async Task<ActionResult<Advertisement>> AddAdvertisement(IFormFile file)
        {
            var adName = HttpContext.Request.Form["adName"];

            if (adName == "") return BadRequest("No Ad Name input found");

            var currentUser = await _uow.UserRepository.GetUserByIdAsync(User.GetUserId());

            if (currentUser == null) return NotFound();

            var result = await _adService.AddAdvertisementAsync(file, currentUser);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var ad = new Advertisement
            {
                AdName = adName,
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            currentUser.PublishedAds.Add(ad);

            if (await _uow.Complete())
            {
                return CreatedAtAction(nameof(UsersController.GetUserByUsername), "Users", new {username = currentUser.UserName}, _mapper.Map<AdvertisementDto>(ad));
            }

            return BadRequest("Problem creating advertisement");
        }

        /*
            Action: Update an existing Advertisement
            Parameters: PK of Advertisement the user is attempting to update
            Request body content: string AdName
            Query String variables: None
        */
        [Authorize (Roles = "Advertiser")]
        [HttpPut("update-advertisement/{advertisementId}")] // /api/advertisements/update-advertisement/{advertisementId}
        public async Task<ActionResult> UpdateAdvertisement(int advertisementId, AdvertisementUpdateDto adUpdateDto)
        {
            var ad = await _uow.AdvertisementRepository.GetAdvertisementByIdAsync(advertisementId);

            if (ad == null) return NotFound();

            var currentUser = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            if (currentUser.Id != ad.AdvertisingUserId) return BadRequest("You cannot edit an advertisement you did not publish");

            if (ad.AdName == adUpdateDto.AdName || adUpdateDto.AdName == "") return BadRequest("No valid updates requested");

            ad.AdName = adUpdateDto.AdName;

            if (await _uow.Complete()) return NoContent();

            return BadRequest("Problem updating advertisement details");
        }

        /*
            Action: Replace and existing Advertisement's audio file with a new audio file
            Parameters: New file to store
            Request body content: form-data {advertisementId ==> id of the Advertisement to be manipulated}
            Query String variables: None
        */
        [Authorize (Roles = "Advertiser")]
        [HttpPost("replace-advertisement-file")] // api/advertisements/replace-advertisement-file
        public async Task<ActionResult> ReplaceAdvertisementFile(IFormFile file)
        {
            var advertisementIdStr = HttpContext.Request.Form["advertisementId"];

            if (String.IsNullOrEmpty(advertisementIdStr)) return BadRequest("Missing info in request");

            var advertisementId = int.Parse(advertisementIdStr);

            var ad = await _uow.AdvertisementRepository.GetAdvertisementByIdAsync(advertisementId);

            if (ad == null) return NotFound();

            var currentUser = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            if (currentUser.Id != ad.AdvertisingUserId) return BadRequest("You cannot edit an advertisement you did not publish");

            var replaceResult = await _adService.ReplaceAdvertisementAsync(file, ad.PublicId);

            if (replaceResult.Error != null) return BadRequest(replaceResult.Error.Message);

            ad.Url = replaceResult.SecureUrl.AbsoluteUri;

            if (await _uow.Complete()) return NoContent();

            return BadRequest("Problem replacing advertisement audio file");
        }

        /*
            Action: Delete an existing Advertisement
            Parameters: PK of Advertisement the user is attempting to delete
            Request body content: None
            Query String variables: None
        */
        [Authorize (Roles = "Advertiser")]
        [HttpDelete("delete-advertisement/{advertisementId}")]
        public async Task<ActionResult> DeleteAdvertisement(int advertisementId)
        {
            var ad = await _uow.AdvertisementRepository.GetAdvertisementByIdAsync(advertisementId);

            if (ad == null) return NotFound();

            var currentUser = await _uow.UserRepository.GetUserByIdAsync(User.GetUserId());

            if (currentUser.Id != ad.AdvertisingUserId) return BadRequest("You cannot edit an advertisement you did not publish");

            if (ad.PublicId != null)
            {
                var result = await _adService.DeleteAdvertisementAsync(ad.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }
            
            // Cloudinary deletion successful; safe to remove from database
            currentUser.PublishedAds.Remove(ad);

            if (await _uow.Complete()) return Ok();

            return BadRequest("Problem deleting advertisement");
        }

        /*
            Action: 
            Parameters: 
            Request body content: 
            Query String variables: 
        */
        [Authorize (Roles = "AppMember")]
        [HttpGet("advertisements-to-serve")]
        public async Task<ActionResult<List<AdvertisementDto>>> GetAdvertisementsToServe()
        {
            return await _uow.AdvertisementRepository.GetRandomAdvertisements(1);
        }

        /*
            Action: 
            Parameters: 
            Request body content: 
            Query String variables: 
        */


        /*
            Action: 
            Parameters: 
            Request body content: 
            Query String variables: 
        */
    }
}
