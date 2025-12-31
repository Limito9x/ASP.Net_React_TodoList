using MyFirstProject.Server.Models.Enums;

namespace MyFirstProject.Server.Models
{
    public class ChatMessage: BaseSimpleEntity
    {
        public int SessionId { get; set; }
        public ChatSession? Session { get; set; }
        public string Role { get; set; } // e.g., "user", "assistant", "system"
        public string Content { get; set; }
        public MessageType Type { get; set; } = MessageType.Text;
    }
}
