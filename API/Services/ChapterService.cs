using API.Entities;
using API.Helpers;
using API.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace API.Services
{
    public class ChapterService : IChapterService
    {
        private readonly Cloudinary _cloudinary;
        public ChapterService(IOptions<CloudinarySettings> config)
        {
            var cloudinaryAccount = new Account
            (
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(cloudinaryAccount);
        }
        public async Task<VideoUploadResult> AddChapterAsync(IFormFile file, Book book)
        {
            var uploadResult = new VideoUploadResult();

            if (file.Length > 0)
            {
                using var stream = file.OpenReadStream();
                var uploadParams = new VideoUploadParams()
                {
                    File = new FileDescription(file.FileName, stream),
                    // Transformation = new Transformation(),
                    Folder = "bookend-net7/" + book.Id.ToString()
                };

                uploadResult = await _cloudinary.UploadAsync(uploadParams);
            }

            return uploadResult;
        }

        public async Task<VideoUploadResult> ReplaceChapterAsync(IFormFile file, string publicId)
        {
            var replaceResult = new VideoUploadResult();

            if (file.Length > 0)
            {
                using var stream = file.OpenReadStream();
                var uploadParams = new VideoUploadParams()
                {
                    File = new FileDescription(file.FileName, stream),
                    PublicId = publicId,
                    Overwrite = true
                };

                replaceResult = await _cloudinary.UploadAsync(uploadParams);
            }

            return replaceResult;
        }

        public async Task<DeletionResult> DeleteChapterAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);

            return await _cloudinary.DestroyAsync(deleteParams);
        }
    }
}
