namespace API.DTOs
{
    public class CommentDto
    {
        public int Id { get; set; }
        public int Timestamp { get; set; }
        public string CommentText { get; set; }
        public int CommentingUserId { get; set; }
    }
}
