using MyFirstProject.Server.Models.Enums;

namespace MyFirstProject.Server.Models
{
    public class Asset
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string Url { get; set; }
        public FileType Type { get; set; }
        public string Extension { get; set; }
        public long FileSize { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int PlanId { get; set; }
        public Plan Plan { get; set; }
        public int? TaskId { get; set; }
        public TaskItem? Task { get; set; } // Phục vụ cho việc giả sử khi ta xem 1 asset trong kho, ta có thể chú thích thêm asset này thuộc về task nào nếu có
    }
}
