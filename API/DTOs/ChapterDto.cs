namespace API.Chapters
{
    public class ChapterDto
    {
        public int Id { get; set; }
        public int ChapterNumber { get; set; }
        public string ChapterTitle { get; set; }
        public string Url { get; set; }
        public string PublicId { get; set; }
        public int BookId { get; set; }
    }
}
