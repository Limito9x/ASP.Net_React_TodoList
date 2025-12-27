using MyFirstProject.Server.Models.Enums;
using System.Text.Json;

namespace MyFirstProject.Server.Models
{
    public class MetadataField
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Label { get; set; } // Khối lượng, Chiều cao, Màu sắc, etc.
        public JsonElement  Value { get; set; } // Linh hoạt theo Type vì chúng ta không biết trước người dùng sẽ nhập gì
        public required MetadataFieldType Type { get; set; } // text, number, date, etc.
        public JsonElement DefaultValue { get; set; } // default value for the field
    }

    public class MediaValue
    {
        public int AssetId { get; set; }
        public string Url { get; set; }
        public string? PublicId { get; set; }
    }

    public class  MetadataRow
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public List<MetadataField> Fields { get; set; } // Danh sách các trường metadata trong hàng này
    }

    public class Form : BaseEntity
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public List<MetadataRow> Rows { get; set; } = new();
        public int UserId { get; set; } // Template do 1 người dùng tạo ra
        public User? User { get; set; }
    }
}
