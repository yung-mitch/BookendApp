namespace API.DTOs
{
    public class ClubDto
    {
        public int Id { get; set; }
        public string ClubName { get; set; }
        public int? OwningUserId { get; set; }
    }
}
