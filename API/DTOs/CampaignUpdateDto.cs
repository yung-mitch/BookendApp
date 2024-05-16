namespace API.DTOs
{
    public class CampaignUpdateDto
    {
        public string Title { get; set; }
        public bool Active { get; set; }
        public double Budget { get; set; }
        public int TargetMinAge { get; set; }
        public int TargetMaxAge { get; set; }
        public List<string> TargetEthnicities { get; set; }
        public List<string> TargetGenreInterests { get; set; }
        public int AdvertisementId { get; set; }
    }
}
