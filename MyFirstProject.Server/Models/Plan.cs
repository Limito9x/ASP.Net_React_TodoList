namespace MyFirstProject.Server.Models
{
    public class Plan: TimeLineEntity
    {
        public required string Title { get; set; }
        public string? Description { get; set; }
        public decimal? Progress { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public List<Phase>? Phases { get; set; }
    }
}
