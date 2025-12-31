namespace MyFirstProject.Server.Models
{
    public class ChatSession: BaseEntity
    {
        public string Title { get; set; }
        public int? PlanId { get; set; }
        public int UserId { get; set; }
        ICollection<ChatMessage>? ChatMessages { get; set; }
    }
}
