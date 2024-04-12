namespace API.Entities
{
    public class BookClubBook
    {
        public int BookId { get; set; }
        public Book Book { get; set; }
        public int ClubId { get; set; }
        public BookClub Club { get; set; }
    }
}
