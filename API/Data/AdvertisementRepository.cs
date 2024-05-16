using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class AdvertisementRepository : IAdvertisementRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public AdvertisementRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<AdvertisementDto> GetAdvertisementAsync(int id)
        {
            return await _context.Advertisements
                .Where(x => x.Id == id)
                .ProjectTo<AdvertisementDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<Advertisement> GetAdvertisementByIdAsync(int id)
        {
            return await _context.Advertisements.FindAsync(id);
        }

        public async Task<IEnumerable<Advertisement>> GetAdvertisementsAsync()
        {
            return await _context.Advertisements.ToListAsync();
        }

        public async Task<IEnumerable<AdvertisementDto>> GetAdvertisementDtosAsync()
        {
            return await _context.Advertisements
                .ProjectTo<AdvertisementDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<PagedList<AdvertisementDto>> GetUserAdvertisementsAsync(int userId, AdvertisementParams adParams)
        {
            var query = _context.Advertisements
                .Where(a => a.AdvertisingUserId == userId)
                .ProjectTo<AdvertisementDto>(_mapper.ConfigurationProvider)
                .OrderByDescending(a => a.Id)
                .AsNoTracking();

            return await PagedList<AdvertisementDto>.CreateAsync(query, adParams.PageNumber, adParams.PageSize);
        }

        public async Task<List<CampaignDto>> GetRandomAdvertisements(int numberOfAds)
        {
            Random rand = new Random();
            int skipper = rand.Next(0, _context.Set<Advertisement>().Count());

            return await _context.Campaigns
                .OrderBy(x => x.Id)
                .Skip(skipper)
                .Take(numberOfAds)
                .Include(c => c.Advertisement)
                .ProjectTo<CampaignDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<IEnumerable<Campaign>> GetCampaignsAsync()
        {
            return await _context.Campaigns.ToListAsync();
        }

        public async Task<IEnumerable<CampaignDto>> GetCampaignsDtosAsync()
        {
            return await _context.Campaigns
                .ProjectTo<CampaignDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public void AddNewCampaign(Campaign campaign)
        {
            _context.Campaigns.Add(campaign);
        }

        public void DeleteCampaign(Campaign campaign)
        {
            _context.Campaigns.Remove(campaign);
        }

        public async Task<PagedList<CampaignDto>> GetUserCampaignsAsync(int userId, CampaignParams campaignParams)
        {
            var query = _context.Campaigns
                .Where(c => c.AdvertisingUserId == userId)
                .ProjectTo<CampaignDto>(_mapper.ConfigurationProvider)
                .OrderByDescending(c => c.Id)
                .AsNoTracking();
            
            return await PagedList<CampaignDto>.CreateAsync(query, campaignParams.PageNumber, campaignParams.PageSize);
        }

        public async Task<Campaign> GetCampaignByIdAsync(int id)
        {
            return await _context.Campaigns.FindAsync(id);
        }

        public async Task<CampaignDto> GetCampaignDtoByIdAsync(int id)
        {
            return await _context.Campaigns
                .Where( c => c.Id == id)
                .ProjectTo<CampaignDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<Campaign>> GetCampaignsUsingAd(int id)
        {
            return await _context.Campaigns
                .Where(c => c.AdvertisementId == id)
                .ToListAsync();
        }
    }
}
