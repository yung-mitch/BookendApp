using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : IdentityDbContext<AppUser, AppRole, int,
        IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>,
        IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Book> Books { get; set; }
        public DbSet<Chapter> Chapters { get; set; }
        public DbSet<UserBook> UserBooks { get; set; }
        public DbSet<Advertisement> Advertisements { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<AppUser>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(u => u.User)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();

            builder.Entity<AppUser>()
                .HasMany(u => u.PublishedBooks)
                .WithOne(b => b.PublishingUser)
                .HasForeignKey(b => b.PublishingUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<AppUser>()
                .HasMany(u => u.ReviewsLeft)
                .WithOne(r => r.ReviewingUser)
                .HasForeignKey(r => r.ReviewingUserId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            builder.Entity<AppUser>()
                .HasMany(u => u.CommentsLeft)
                .WithOne(c => c.CommentingUser)
                .HasForeignKey(c => c.CommentingUserId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            builder.Entity<AppRole>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(u => u.Role)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();

            builder.Entity<Book>()
                .HasMany(bc => bc.Chapters)
                .WithOne(b => b.Book)
                .HasForeignKey(bc => bc.BookId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Book>()
                .HasMany(b => b.Reviews)
                .WithOne(r => r.Book)
                .HasForeignKey(r => r.BookId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Chapter>()
                .HasMany(ch => ch.Comments)
                .WithOne(c => c.Chapter)
                .HasForeignKey(c => c.ChapterId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserBook>()
                .HasKey(k => new {k.UserId, k.BookId});

            builder.Entity<UserBook>()
                .HasOne(ub => ub.User)
                .WithMany(u => u.UserLibraryBooks)
                .HasForeignKey(ub => ub.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserBook>()
                .HasOne(ub => ub.Book)
                .WithMany(b => b.UserLibraryBooks)
                .HasForeignKey(ub => ub.BookId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
