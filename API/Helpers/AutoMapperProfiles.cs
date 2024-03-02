using API.Chapters;
using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>();
            CreateMap<RegisterDto, AppUser>();
            CreateMap<Book, BookDto>();
            CreateMap<Book, BookDetailDto>();
            CreateMap<BookDto, Book>();
            CreateMap<BookUpdateDto, Book>();
            CreateMap<Chapter, ChapterDto>();
            CreateMap<Book, FullBookDto>();
            CreateMap<Advertisement, AdvertisementDto>();
            CreateMap<AdvertisementUpdateDto, Advertisement>();
        }
    }
}