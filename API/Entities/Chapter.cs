using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Chapters")]
    public class Chapter
    {
        public int Id { get; set; }
        public string ChapterTitle { get; set; }
        public string Url { get; set; }
        

        public int BookId { get; set; }
        public Book Book { get; set; }
    }
}