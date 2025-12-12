using System.ComponentModel.DataAnnotations;

namespace MyFirstProject.Server.Dtos
{
    public class CreatePlanDto // Dto dùng để tạo mới Plan 
    {
        [Required]
        public required string Title { get; set; }
        public string? Description { get; set; }
        public DateTime? EndDate { get; set; }
        public int UserId { get; set; }
    }

    public class UpdatePlanDto // Dto dùng để cap nhật Plan, bỏ đi userId vì trường này chỉ sử dụng khi tạo mới
    {
        [Required]
        public required string Title { get; set; }
        public string? Description { get; set; }
        public DateTime? EndDate { get; set; }
    }

    public class PlanResponseDto
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
