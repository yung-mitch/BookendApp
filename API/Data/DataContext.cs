﻿using API.Entities;
using AutoMapper.Execution;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Newtonsoft.Json;

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
        public DbSet<Campaign> Campaigns { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<BookClub> BookClubs { get; set;}
        public DbSet<UserClub> UserClubs { get; set; }
        public DbSet<BookClubBook> BookClubBooks { get; set; }

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

            builder.Entity<AppUser>()
                .HasMany(u => u.PublishedCampaigns)
                .WithOne(c => c.AdvertisingUser)
                .HasForeignKey(c => c.AdvertisingUserId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<Advertisement>()
                .HasMany(a => a.AdCampaigns)
                .WithOne(c => c.Advertisement)
                .HasForeignKey(c => c.AdvertisementId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<Campaign>()
                .Property(c => c.TargetEthnicities)
                .HasConversion(new ValueConverter<List<string>, string>(
                    val => JsonConvert.SerializeObject(val),
                    val => JsonConvert.DeserializeObject<List<string>>(val)
                ));

            builder.Entity<Campaign>()
                .Property(c => c.TargetMinAge)
                .HasDefaultValue(18);

            builder.Entity<Campaign>()
                .Property(c => c.TargetMaxAge)
                .HasDefaultValue(100);

            builder.Entity<Campaign>()
                .Property(c => c.TargetGenreInterests)
                .HasConversion(new ValueConverter<List<string>, string>(
                    val => JsonConvert.SerializeObject(val),
                    val => JsonConvert.DeserializeObject<List<string>>(val)
                ));

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

            builder.Entity<Chapter>()
                .Property(c => c.ChapterNumber)
                .HasDefaultValue(500);

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

            builder.Entity<UserClub>()
                .HasKey(k => new {k.BookClubId, k.UserId});

            builder.Entity<UserClub>()
                .HasOne(uc => uc.User)
                .WithMany(u => u.MemberClubs)
                .HasForeignKey(ub => ub.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserClub>()
                .HasOne(uc => uc.Club)
                .WithMany(bc => bc.ClubMembers)
                .HasForeignKey(uc => uc.BookClubId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<BookClub>()
                .HasOne(bc => bc.OwningUser)
                .WithMany(u => u.OwnedClubs)
                .HasForeignKey(bc => bc.OwningUserId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            builder.Entity<BookClubBook>()
                .HasKey(k => new {k.ClubId, k.BookId});

            builder.Entity<BookClubBook>()
                .HasOne(bcb => bcb.Book)
                .WithMany(b => b.ClubCheckouts)
                .HasForeignKey(bcb => bcb.BookId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<BookClubBook>()
                .HasOne(bcb => bcb.Club)
                .WithMany(bc => bc.ClubBooks)
                .HasForeignKey(bcb => bcb.ClubId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
