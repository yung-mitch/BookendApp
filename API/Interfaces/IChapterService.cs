using API.Entities;
using CloudinaryDotNet.Actions;

namespace API.Interfaces
{
    public interface IChapterService
    {
        Task<VideoUploadResult> AddChapterAsync(IFormFile file, Book book);
        Task<DeletionResult> DeleteChapterAsync(string publicId);
    }
}
