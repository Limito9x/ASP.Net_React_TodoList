namespace MyFirstProject.Server.Models
{
    public enum Frequency
    {
        Daily,
        Weekly,
        Monthly,
        Yearly
    }

    public class RecurrenceRule
    {
        public Frequency Frequency { get; set; }
        public int Interval { get; set; } = 1;
        public List<int>? DaysOfWeek { get; set; }
        public List<int>? DaysOfMonth { get; set; }
        public DateTime? EndDate { get; set; }
        public int? OccurrenceCount { get; set; }
    }

    public class Routine: BaseEntity
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public TimeOnly ScheduledTime { get; set; }
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
        public DateTime? EndDate { get; set; }
        public RecurrenceRule Rule { get; set; }
        public int? ExpectedTotalCount { get; set; } // Tổng số lần công việc xuất hiện dự kiến dựa trên quy tắc lặp lại
        public DateTime NextOccurrence { get; set; }
        public List<int>? LinkedFormIds { get; set; } = new();
        public List<LinkedGoal>? LinkedGoals { get; set; } = new(); // Tham chiếu đến mục tiêu liên kết goal config của phase
        public int UserId { get; set; }
        public User? User { get; set; }
        public int? PhaseId { get; set; }
        public Phase? Phase { get; set; }
        public ICollection<TaskLog>? TaskLogs { get; set; }
    }
}
