namespace MyFirstProject.Server.Models
{
    public class Plan
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
        public DateTime? EndDate { get; set; }
        public double? Progress { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public List<TaskItem>? TaskItems { get; set; }
        public ICollection<Asset>? Assets { get; set; }
    }
}
