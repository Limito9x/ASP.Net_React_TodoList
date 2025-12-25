using MyFirstProject.Server.Models.Enums;

namespace MyFirstProject.Server.Models
{
    public class GoalConfig
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; }
        public GoalType Type { get; set; } = GoalType.TaskOnly;
        public double Start { get; set; }
        public double Target { get; set; }
        public double Current { get; set; }
        public string? Unit { get; set; }
        public decimal CalculateProgress()
        {
            if (Type == GoalType.TaskOnly) return 0;
            if (Type == GoalType.Boolean) return Current >= 1 ? 100 : 0;

            double totalDistance = Math.Abs(Target - Start);
            if (totalDistance < 0.000001) return Current >= Target ? 100 : 0;

            double achievedDistance = Math.Abs(Current - Start);
            return (decimal)Math.Clamp((achievedDistance / totalDistance) * 100, 0, 100);
        }
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
    }
}
