using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Chapters")]
    public class Chapter
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [Range(1, 500)]
        public int ChapterNumber { get; set; }
        public string ChapterTitle { get; set; }
        public string Url { get; set; }
        public string PublicId { get; set; }
        
        public int BookId { get; set; }
        public Book Book { get; set; }
        public List<Comment> Comments { get; set; }
    }
}