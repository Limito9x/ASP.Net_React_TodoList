using MyFirstProject.Server.Models.Enums;

namespace MyFirstProject.Server.Models
{
    public class MetadataForm
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; }
        public List<MetadataRow> Rows { get; set; } = new List<MetadataRow>();
    }
    public class SingleTask: BaseEntity
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime? StartAt { get; set; }
        public DateTime? EndAt { get; set; }
        public SingleTaskStatus Status { get; set; } = SingleTaskStatus.Pending;
        public SingleTaskType Type { get; set; } = SingleTaskType.Normal;
        public string? Note { get; set; }
        public List<Form> Forms { get; set; } = new List<Form>();
        public List<MetadataForm> Data { get; set; } = new List<MetadataForm>();
        public List<int> LinkedGoalIds { get; set; } = new List<int>(); // Tham chiếu đến mục tiêu liên kết goal config của phase
        public int UserId { get; set; }
        public User? User { get; set; }
        public int? PhaseId { get; set; }
        public Phase? Phase { get; set; }
    }
}
