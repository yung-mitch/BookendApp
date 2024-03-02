namespace API.DTOs
{
    public class MemberDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PhotoUrl { get; set; }
        public List<AdvertisementDto> PublishedAdvertisements { get; set; }
    }
}
