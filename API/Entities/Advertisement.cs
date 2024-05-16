using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Advertisements")]
    public class Advertisement
    {
        public int Id { get; set; }
        public string AdName { get; set; }
        public string Url { get; set; }
        public string PublicId { get; set; }

        public int AdvertisingUserId { get; set; }
        public AppUser AdvertisingUser { get; set; }
        public List<Campaign> AdCampaigns { get; set; }
    }
}
