namespace API.DTOs
{
    public class AdvertisementDto
    {
        public int Id { get; set; }
        public string AdName { get; set; }
        public string Url { get; set; }
        public string PublicId { get; set; }
        public int AdvertisingUserId { get; set; }
    }
}
