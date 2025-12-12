using MyFirstProject.Server.Dtos;

namespace MyFirstProject.Server.Services
{
    public interface ITaskItemSerivce
    {
        Task<TaskItemResponseDto> CreateTaskItemAsync(CreateTaskItemDto taskItemDto); // Riêng create không cần userId vì tạo mới nằm trong kế hoạch đã có userId
        Task<List<TaskItemResponseDto>> GetTaskItemsByPlanIdAsync(int planId, int userId);
        Task<TaskItemResponseDto?> GetTaskItemByIdAsync(int taskItemId, int userId);
        Task<TaskItemResponseDto?> UpdateTaskItemByIdAsync(int taskId, UpdateTaskItemDto taskItemDto, int userId); 
        Task<bool> DeleteTaskItemByIdAsync(int taskId, int userId);
    }
}
