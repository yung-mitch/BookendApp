using API.Entities;
using API.Helpers;
using API.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace API.Services
{
    public class AdvertisementService : IAdvertisementService
    {
        private readonly Cloudinary _cloudinary;
        private readonly string _rootDir;

        public AdvertisementService(IOptions<CloudinarySettings> config, IOptions<CloudStorageSettings> storageConfig)
        {
            var cloudinaryAccount = new Account
            (
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(cloudinaryAccount);

            _rootDir = storageConfig.Value.CloudinaryRootDirectory;
        }

        public async Task<VideoUploadResult> AddAdvertisementAsync(IFormFile file, AppUser advertisingUser)
        {
            var uploadResult = new VideoUploadResult();

            if (file.Length > 0)
            {
                using var stream = file.OpenReadStream();
                var uploadParams = new VideoUploadParams()
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = _rootDir + "advertisements/" + advertisingUser.Id.ToString()
                };

                uploadResult = await _cloudinary.UploadAsync(uploadParams);
            }

            return uploadResult;
        }

        public async Task<VideoUploadResult> ReplaceAdvertisementAsync(IFormFile file, string publicId)
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
        
        public async Task<DeletionResult> DeleteAdvertisementAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId)
            {
                ResourceType = ResourceType.Video
            };

            return await _cloudinary.DestroyAsync(deleteParams);
        }
    }
}
