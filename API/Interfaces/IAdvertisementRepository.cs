using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IAdvertisementRepository
    {
        Task<IEnumerable<Advertisement>> GetAdvertisementsAsync();
        Task<IEnumerable<AdvertisementDto>> GetAdvertisementDtosAsync();
        Task<PagedList<AdvertisementDto>> GetUserAdvertisementsAsync(int userId, AdvertisementParams adParams);
        Task<Advertisement> GetAdvertisementByIdAsync(int id);
        Task<AdvertisementDto> GetAdvertisementAsync(int id);
        Task<List<AdvertisementDto>> GetRandomAdvertisements(int numberOfAds);
    }
}
