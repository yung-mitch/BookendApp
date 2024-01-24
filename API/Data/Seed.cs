using System.Text.Json;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            if (await userManager.Users.AnyAsync()) return; // return if the database already has users

            var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");

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

            await userManager.CreateAsync(publisher, "Pa$$w0rd");
            await userManager.AddToRoleAsync(publisher, "Publisher");
        }

        // public static async Task seedBooks()
    }
}
