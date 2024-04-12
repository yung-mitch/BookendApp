namespace API.Entities
{
    public class BookClub
    {
        public int Id { get; set; }
        public string ClubName { get; set; }
        public int? OwningUserId { get; set; }
        public AppUser OwningUser { get; set; }
        public List<UserClub> ClubMembers { get; set; }
        public List<BookClubBook> ClubBooks { get; set; }
    }
}
