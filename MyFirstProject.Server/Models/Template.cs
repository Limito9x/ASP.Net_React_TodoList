namespace MyFirstProject.Server.Models
{
    public class MetadataField
    {
        public string Key { get; set; } // weight , height, color, etc.
        public string Label { get; set; } // Khối lượng, Chiều cao, Màu sắc, etc.
        public string Value { get; set; } // 70, 180, Đỏ, etc.
        public string Type { get; set; } // text, number, date, etc.
        public string DefaultValue { get; set; } // default value for the field
    }

    public class Template
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public List<List<MetadataField>>? Rows { get; set; } // Mảng 2 chiều thể hiện các hàng và cột của metadata
    }
}
