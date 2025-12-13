using MyFirstProject.Server.Models.Enums;

namespace MyFirstProject.Server.Dtos
{
    public class UploadAssetDto
    {
        public List<IFormFile> Files { get; set; }
        public int PlanId { get; set; }
        public int? TaskId { get; set; }
    }

    public class AssetResponseDto
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string PublicId { get; set; }
        public string Url { get; set; }
        public string Extension { get; set; }
        public long FileSize { get; set; }
        public FileType Type { get; set; }
        public DateTime CreatedAt { get; set; }
        public int PlanId { get; set; }
        public int? TaskId { get; set; }
    }
}
