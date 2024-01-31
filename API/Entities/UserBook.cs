namespace API.Entities
{
    public class UserBook
    {
        public AppUser User { get; set; }
        public int UserId { get; set; }
        public Book Book { get; set; }
        public int BookId { get; set; }
    }
}
