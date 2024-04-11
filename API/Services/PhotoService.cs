using API.Helpers;
using API.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace API.Services
{
    public class PhotoService : IPhotoService
    {
        private readonly Cloudinary _cloudinary;
        private readonly string _rootDir;
        public PhotoService(IOptions<CloudinarySettings> config, IOptions<CloudStorageSettings> storageConfig)
        {
            var acc = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(acc);

            _rootDir = storageConfig.Value.CloudinaryRootDirectory;
        }

        public async Task<ImageUploadResult> ReplacePhotoAsync(IFormFile file, string publicId)
        {
            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face"),
                    Overwrite = true,
                    PublicId = publicId
                };
                if (publicId == null) {
                    uploadParams.Folder = _rootDir + "users/photos";
                }

                uploadResult = await _cloudinary.UploadAsync(uploadParams);
            }

            return uploadResult;
        }
    }
}
