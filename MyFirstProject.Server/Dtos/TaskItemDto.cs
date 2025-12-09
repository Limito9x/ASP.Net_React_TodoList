using MyFirstProject.Server.Models.Enums;

namespace MyFirstProject.Server.Dtos
{
    public class TaskItemDto
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        public TodoStatus Status { get; set; }
        public int CategoryId { get; set; }
    }

    public class TaskItemResponseDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedAt { get; set; }
        public TodoStatus Status { get; set; }
        public int CategoryId { get; set; }
        public CategoryResponseDto? Category { get; set; }
    }
}
