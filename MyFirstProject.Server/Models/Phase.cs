using MyFirstProject.Server.Models.Enums;

namespace MyFirstProject.Server.Models
{
    public class GoalConfig
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; }
        public UpdateStrategy Type { get; set; }
        public double Start { get; set; }
        public double Target { get; set; }
        public double Current { get; set; }
        public string? Unit { get; set; }
    }
    public class Phase: TimeLineEntity
    {
        public string Title { get; set; } = "Giai đoạn 1";
        public string? Description { get; set; }
        public int PlanId { get; set; }
        public Plan? Plan { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int Order { get; set; } = 0;
        public List<GoalConfig> Goals { get; set; } = new List<GoalConfig>();
        public decimal? Progress { get; set; }
        public ICollection<SingleTask>? SingleTasks { get; set; } = new List<SingleTask>();
        public ICollection<Routine>? Routines { get; set; } = new List<Routine>();
        public ICollection<TaskLog>? TaskLogs { get; set; } = new List<TaskLog>();
    }
}
