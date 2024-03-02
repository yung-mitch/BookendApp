using API.Entities;
using CloudinaryDotNet.Actions;

namespace API.Interfaces
{
    public interface IAdvertisementService
    {
        Task<VideoUploadResult> AddAdvertisementAsync(IFormFile file, AppUser advertisingUser);
        Task<VideoUploadResult> ReplaceAdvertisementAsync(IFormFile file, string publicId);
        Task<DeletionResult> DeleteAdvertisementAsync(string publicId);
    }
}
