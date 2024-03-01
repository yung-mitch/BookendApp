using API.Chapters;

namespace API.DTOs
{
    public class FullBookDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public int PublishingUserId { get; set; }
        public List<ChapterDto> Chapters { get; set; }
    }
}
