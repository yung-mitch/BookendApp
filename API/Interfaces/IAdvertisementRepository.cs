using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IAdvertisementRepository
    {
        Task<IEnumerable<Advertisement>> GetAdvertisementsAsync();
        Task<IEnumerable<AdvertisementDto>> GetAdvertisementDtosAsync();
        Task<IEnumerable<AdvertisementDto>> GetUserAdvertisementsAsync(int userId);
        Task<Advertisement> GetAdvertisementByIdAsync(int id);
        Task<AdvertisementDto> GetAdvertisementAsync(int id);
    }
}
