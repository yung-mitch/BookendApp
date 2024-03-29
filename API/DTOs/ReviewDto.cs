namespace API.DTOs
{
    public class ReviewDto
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string ReviewText { get; set; }
        public int ReviewingUserId { get; set; }
        public string ReviewingUserName { get; set; }
        public string ReviewingUserPhotoUrl { get; set; }
    }
}
