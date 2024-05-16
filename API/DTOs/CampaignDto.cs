namespace API.DTOs
{
    public class CampaignDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public bool Active { get; set; }
        public double Budget { get; set; }
        public bool InsufficientFunds { get; set; }
        public int NumPlays { get; set; }
        public int NumClicks { get; set; }
        public int TargetMinAge { get; set; }
        public int TargetMaxAge { get; set; }
        public List<string> TargetEthnicities { get; set; }
        public List<string> TargetGenreInterests { get; set; }
        public AdvertisementDto Advertisement { get; set; }
        public int AdvertisementId { get; set; }
    }
}
