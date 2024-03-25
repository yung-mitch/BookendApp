using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser<int>
    {
        public ICollection<AppUserRole> UserRoles { get; set; }
        public List<UserBook> UserLibraryBooks { get; set; }
        public List<Book> PublishedBooks { get; set; }
        public List<Advertisement> PublishedAds { get; set; } = new();
        public Photo ProfilePhoto { get; set; } = new();
        public List<Review> ReviewsLeft { get; set; }
        public List<Comment> CommentsLeft { get; set; }
    }
}
