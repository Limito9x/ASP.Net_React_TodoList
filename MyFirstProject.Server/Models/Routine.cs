namespace MyFirstProject.Server.Models
{
    public enum Frequence
    {
        Daily,
        Weekly,
        Monthly,
        Yearly
    }

    public class RecurrenceRule
    {
        public Frequence Frequence { get; set; }
        public int Interval { get; set; } = 1;
        public List<int>? DaysOfWeek { get; set; }
        public List<int>? DaysOfMonth { get; set; }

        // Điều kiện kết thúc
        public DateTime? EndDate { get; set; }
        public int? OccurrenceCount { get; set; }
    }

    public class Routine: BaseEntity
    {
        public required string Title { get; set; }
        public string? Description { get; set; }
        public TimeOnly ScheduledTime { get; set; }
        public RecurrenceRule Rule { get; set; }
        public DateTime NextOccurence { get; set; }
        public List<Form> Forms { get; set; } = new List<Form>();
        //public List<MetadataForm> Data { get; set; } = new List<MetadataForm>();
        public List<int> LinkedGoalIds { get; set; } = new List<int>(); // Tham chiếu đến mục tiêu liên kết goal config của phase
        public int UserId { get; set; }
        public User? User { get; set; }
        public int? PhaseId { get; set; }
        public Phase? Phase { get; set; }

    }
}
