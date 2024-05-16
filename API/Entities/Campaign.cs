namespace API.Entities
{
    public class Campaign
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public bool Active { get; set; }
        public double Budget { get; set; }
        public double CostPerPlay { get; set; }
        public bool InsufficientFunds { get; set; }
        public int NumPlays { get; set; }
        public int NumClicks { get; set; }
        public int TargetMinAge { get; set; }
        public int TargetMaxAge { get; set; }
        public List<string> TargetEthnicities { get; set; } = new();
        public List<string> TargetGenreInterests { get; set; } = new();

        public int AdvertisingUserId { get; set; }
        public AppUser AdvertisingUser { get; set; }
        public int AdvertisementId { get; set; }
        public Advertisement Advertisement { get; set; }
    }
}
