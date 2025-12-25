using System.Drawing;

namespace MyFirstProject.Server.Models
{
    public class Tag: BaseEntity
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? Color { get; set; } // Màu sắc của Tag, có thể dùng mã HEX
        public int UserId { get; set; } // Tag do 1 người dùng tạo ra
        public User? User { get; set; }
        public ICollection<Plan> Plans { get; set; } = new List<Plan>(); // Nhiều Plan có thể có nhiều Tag
        public ICollection<SingleTask>? SingleTasks { get; set; } = new List<SingleTask>(); // Nhiều TaskItem có thể có nhiều Tag
        public ICollection<Form>? Forms { get; set; } = new List<Form>(); // Nhiều Form có thể có nhiều Tag
}
}
