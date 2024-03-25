namespace API.Entities
{
    public class Review
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string ReviewText { get; set; }
        public int BookId { get; set; }
        public Book Book { get; set; }
        public int ReviewingUserId { get; set; }
        public AppUser ReviewingUser { get; set; }
    }
}
