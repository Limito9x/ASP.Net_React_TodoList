using System.ComponentModel.DataAnnotations;

namespace MyFirstProject.Server.Dtos
{
    public class CategoryDto
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
    }

    public class CategoryResponseDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public int UserId { get; set; }
    }
}
