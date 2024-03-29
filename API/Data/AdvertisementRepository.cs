﻿using API.DTOs;
using API.Entities;
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

        public async Task<IEnumerable<AdvertisementDto>> GetUserAdvertisementsAsync(int userId)
        {
            return await _context.Advertisements
                .Where(x => x.AdvertisingUserId == userId)
                .ProjectTo<AdvertisementDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }
    }
}
