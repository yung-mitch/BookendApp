namespace API.Entities
{
    public class UserClub
    {
        public int UserId { get; set; }
        public AppUser User { get; set; }
        public int BookClubId { get; set; }
        public BookClub Club { get; set; }
    }
}
