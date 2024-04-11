using CloudinaryDotNet.Actions;

namespace API.Interfaces
{
    public interface IPhotoService
    {
        Task<ImageUploadResult> ReplacePhotoAsync(IFormFile file, string publicId);
    }
}
