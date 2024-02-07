using API.Chapters;

namespace API.DTOs
{
    public class BookDetailDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public List<ChapterDto> Chapters { get; set; }
    }
}
