using MyFirstProject.Server.Models.Enums;

namespace MyFirstProject.Server.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedAt { get; set; }
        public TodoStatus Status { get; set; } = TodoStatus.Todo;
        public int CategoryId { get; set; }
        public Category? Category { get; set; }
    }
}
