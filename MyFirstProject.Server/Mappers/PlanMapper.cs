using MyFirstProject.Server.Models;
using MyFirstProject.Server.Dtos;

namespace MyFirstProject.Server.Mappers
{
    public static class PlanMapper
    {
        // Map từ Model sang Dto cho trường hợp trả về dữ liệu
        public static PlanResponseDto ToDto(this Plan Plan)
        {
            return new PlanResponseDto
            {
                Id = Plan.Id,
                Title =  Plan.Title,
                Description = Plan.Description,
                StartDate = Plan.StartDate,
                EndDate = Plan.EndDate,
            };
        }
        // Map từ Dto sang Model cho trường hợp tạo mới dữ liệu
        public static Plan ToCreateModel(this CreatePlanDto PlanDto, int userId)
        {
            return new Plan
            {
                Title = PlanDto.Title,
                Description = PlanDto.Description,
                EndDate = PlanDto.EndDate,
                UserId = userId
            };
        }

        // Map từ Dto sang Model cho trường hợp cập nhật dữ liệu
        // Lấy đối tượng Plan hiện có và cập nhật các thuộc tính từ PlanDto
        public static void UpdateFromDto(this Plan currentPlan, UpdatePlanDto updatePlanDto)
        {
            currentPlan.Title = updatePlanDto.Title;
            currentPlan.Description = updatePlanDto.Description;
            currentPlan.EndDate = updatePlanDto.EndDate;
        }
    }
}
