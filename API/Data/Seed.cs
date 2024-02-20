using System.Text.Json;
using API.Entities;
using API.Helpers;
using API.Services;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            if (await userManager.Users.AnyAsync()) return; // return if the database already has users

            var userData = await File.ReadAllTextAsync("Data/UsersSeedData.json");

            var options = new JsonSerializerOptions{PropertyNameCaseInsensitive = true};

            var users = JsonSerializer.Deserialize<List<AppUser>>(userData, options);

            var roles = new List<AppRole>
            {
                new AppRole{Name = "AppMember"},
                new AppRole{Name = "Admin"},
                new AppRole{Name = "Publisher"},
                new AppRole{Name = "Advertiser"},
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            foreach (var user in users)
            {
                await userManager.CreateAsync(user, "Pa$$w0rd");
                await userManager.AddToRoleAsync(user, "AppMember");
            }

            var adminUser = new AppUser
            {
                UserName = "admin",
                Email = "admin@admin.com"
            };

            await userManager.CreateAsync(adminUser, "Pa$$w0rd");
            await userManager.AddToRoleAsync(adminUser, "Admin");
            
            var advertiser = new AppUser
            {
                UserName = "advertiser",
                Email = "advertiser@ad.com"
            };

            await userManager.CreateAsync(advertiser, "Pa$$w0rd");
            await userManager.AddToRoleAsync(advertiser, "Advertiser");

            var publisher = new AppUser
            {
                UserName = "publisher",
                Email = "pub@pub.com"
            };

            var publisher2 = new AppUser
            {
                UserName = "publisher2",
                Email = "pub2@pub.com"
            };

            await userManager.CreateAsync(publisher, "Pa$$w0rd");
            await userManager.AddToRoleAsync(publisher, "Publisher");

            await userManager.CreateAsync(publisher2, "Pa$$w0rd");
            await userManager.AddToRoleAsync(publisher2, "Publisher");
        }

        public static async Task SeedBooks(DataContext context, ConfigurationManager config, bool envIsDev)
        {
            if (await context.Books.AnyAsync()) return; // return if the database already has books

            var bookData = await File.ReadAllTextAsync("Data/BookSeedData.json");
            var chapterData = await File.ReadAllTextAsync("Data/ChapterSeedData.json");
            
            var options = new JsonSerializerOptions{PropertyNameCaseInsensitive = true};

            var books = JsonSerializer.Deserialize<List<Book>>(bookData, options);
            var chapters = JsonSerializer.Deserialize<List<Chapter>>(chapterData, options);

            foreach (var book in books)
            {
                book.PublishingUser = await context.Users.SingleOrDefaultAsync(x => x.UserName == "publisher");
                await context.Books.AddAsync(book);
            }

            var section = config.GetSection("CloudinarySettings");

            var cloudinaryAccount = new Account
            (
                section["CloudName"],
                section["ApiKey"],
                section["ApiSecret"]
            );

            var cloudinary = new Cloudinary(cloudinaryAccount);

            string path = Path.Combine(Directory.GetCurrentDirectory(), "Data/SeedChapter.wav");
            var fileStream = File.OpenRead(path);
            var file = new FormFile(fileStream, 0, fileStream.Length, null, fileStream.Name);
            var cloudParentDirectory = (envIsDev) ? "bookend-net7-dev" : "bookend-net7-production";

            foreach (var book in books)
            {
                for (int i=books.IndexOf(book) * books.Count; i < (books.IndexOf(book) * books.Count) + books.Count; i++)
                {
                    using var stream = file.OpenReadStream();
                    var uploadParams = new VideoUploadParams();
                    uploadParams.File = new FileDescription(file.FileName, stream);
                    uploadParams.Folder = cloudParentDirectory + "/" + (books.IndexOf(book) + 1);
                    var result = await cloudinary.UploadAsync(uploadParams);
                    if (result.Error != null) break;
                    chapters[i].Url = result.SecureUrl.AbsoluteUri;
                    chapters[i].PublicId = result.PublicId;
                    book.Chapters.Add(chapters[i]);

                    uploadParams.Folder = null;
                }
            }

            await context.SaveChangesAsync();
        }
    }
}
