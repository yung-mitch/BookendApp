using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IAdvertisementRepository
    {
        Task<IEnumerable<Advertisement>> GetAdvertisementsAsync();
        Task<IEnumerable<AdvertisementDto>> GetAdvertisementDtosAsync();
        Task<IEnumerable<Campaign>> GetCampaignsAsync();
        Task<IEnumerable<CampaignDto>> GetCampaignsDtosAsync();
        Task<PagedList<AdvertisementDto>> GetUserAdvertisementsAsync(int userId, AdvertisementParams adParams);
        Task<Advertisement> GetAdvertisementByIdAsync(int id);
        Task<AdvertisementDto> GetAdvertisementAsync(int id);
        Task<List<CampaignDto>> GetRandomAdvertisements(int numberOfAds);
        Task<PagedList<CampaignDto>> GetUserCampaignsAsync(int userId, CampaignParams campaignParams);
        Task<Campaign> GetCampaignByIdAsync(int id);
        Task<CampaignDto> GetCampaignDtoByIdAsync(int id);
        Task<IEnumerable<Campaign>> GetCampaignsUsingAd(int id);

        void AddNewCampaign(Campaign campaign);
        void DeleteCampaign(Campaign campaign);
    }
}
