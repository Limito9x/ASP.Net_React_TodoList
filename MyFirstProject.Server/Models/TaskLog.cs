using MyFirstProject.Server.Models.Enums;

namespace MyFirstProject.Server.Models
{
    public class MetadataForm
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; }
        public List<MetadataRow> Rows { get; set; } = new List<MetadataRow>();
    }
    public class  LinkedGoal
    {
        public required string GoalId { get; set; }
        public int DefaultValue { get; set; }
    }
    public class  Contribution
    {
        public required string GoalId { get; set; }
        public int ActualValue { get; set; }
    }
    public class TaskLog: BaseEntity
    {
        public TaskLogStatus Status { get; set; }
        public string? Note { get; set; }
        public List<MetadataForm>? Data { get; set; } = new List<MetadataForm>();
        public DateTime? CompletedAt { get; set; }
        public List<Contribution>? Contributions { get; set; } = new List<Contribution>();
        public int? RoutineId { get; set; }
        public Routine? Routine { get; set; }
        public int? SingleTaskId { get; set; }
        public SingleTask? SingleTask { get; set; }
        public int? PhaseId { get; set; }
        public Phase? Phase { get; set; }

    }
}
