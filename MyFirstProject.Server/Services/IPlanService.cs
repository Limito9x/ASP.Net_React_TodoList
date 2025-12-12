using MyFirstProject.Server.Dtos;

namespace MyFirstProject.Server.Services
{
    public interface IPlanService
    {
        Task<PlanResponseDto> CreatePlanAsync(CreatePlanDto PlanDto, int userId);
        Task<List<PlanResponseDto>> GetPlansByUserIdAsync(int userId);
        Task<PlanResponseDto?> GetPlanByIdAsync(int PlanId, int userId);
        Task<PlanResponseDto> UpdatePlanAsync(int PlanId, UpdatePlanDto PlanDto, int userId);
        Task<bool> DeletePlanAsync(int PlanId, int userId);
    }
}
