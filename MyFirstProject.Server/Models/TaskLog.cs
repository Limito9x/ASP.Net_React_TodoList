namespace MyFirstProject.Server.Models
{
    public class TaskLog: BaseEntity
    {
        public string? Note { get; set; }
        public List<MetadataForm> Data { get; set; } = new List<MetadataForm>();
        public DateTime CompletedAt { get; set; }
        public int RoutineId { get; set; }
        public Routine? Routine { get; set; }
    }
}
