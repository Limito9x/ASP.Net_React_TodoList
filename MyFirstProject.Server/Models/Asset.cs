using MyFirstProject.Server.Models.Enums;

namespace MyFirstProject.Server.Models
{
    public class Asset: BaseSimpleEntity
    {
        public string FileName { get; set; }
        public string PublicId { get; set; }
        public string Url { get; set; }
        public FileType Type { get; set; }
        public string Extension { get; set; }
        public long FileSize { get; set; }
        public int AssetLinkId { get; set; }
        public AssetLink? AssetLink { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
    }
}
