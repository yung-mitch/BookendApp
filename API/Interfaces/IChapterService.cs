using API.Entities;
using CloudinaryDotNet.Actions;

namespace API.Interfaces
{
    public interface IChapterService
    {
        Task<VideoUploadResult> AddChapterAsync(IFormFile file, Book book);
        Task<VideoUploadResult> ReplaceChapterAsync(IFormFile file, string publicId);
        Task<DeletionResult> DeleteChapterAsync(string publicId);
    }
}
