using MyFirstProject.Server.Models.Enums;

namespace MyFirstProject.Server.Models
{
    public class SingleTask: BaseEntity
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? StartAt { get; set; }
        public DateTime? EndAt { get; set; }
        public SingleTaskStatus Status { get; set; } = SingleTaskStatus.Pending;
        public SingleTaskType Type { get; set; } = SingleTaskType.Normal;
        public List<int>? LinkedFormIds { get; set; } = new();
        public List<LinkedGoal>? LinkedGoals { get; set; } = new();
        public int UserId { get; set; }
        public User? User { get; set; }
        public int? PhaseId { get; set; }
        public Phase? Phase { get; set; }
        public ICollection<TaskLog>? TaskLogs { get; set; }
    }
}
