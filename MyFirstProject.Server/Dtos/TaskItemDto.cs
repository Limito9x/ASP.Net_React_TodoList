using MyFirstProject.Server.Models.Enums;

namespace MyFirstProject.Server.Dtos
{
    // Dto dùng để tạo mới TaskItem, bỏ đi status vì khi tạo mới thì status mặc định là Todo
    public class CreateTaskItemDto
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        public int PlanId { get; set; }
    }

    // Dto dùng để cập nhật TaskItem, có thêm status để có thể cập nhật trạng thái công việc
    public class UpdateTaskItemDto
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        public TodoStatus Status { get; set; }
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
        //public int PlanId { get; set; }
        //public PlanResponseDto? Plan { get; set; }
    }
}
