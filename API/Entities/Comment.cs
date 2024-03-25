namespace API.Entities
{
    public class Comment
    {
        public int Id { get; set; }
        public int Timestamp { get; set; }
        public string CommentText { get; set; }
        public int ChapterId { get; set; }
        public Chapter Chapter { get; set; }
        public int CommentingUserId { get; set; }
        public AppUser CommentingUser { get; set; }
    }
}
