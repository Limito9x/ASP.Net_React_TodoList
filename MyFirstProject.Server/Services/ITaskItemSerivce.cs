using MyFirstProject.Server.Dtos;

namespace MyFirstProject.Server.Services
{
    public interface ITaskItemSerivce
    {
        Task<TaskItemResponseDto> CreateTaskItemAsync(TaskItemDto taskItemDto);
        Task<List<TaskItemResponseDto>> GetTaskItemsByCategoryIdAsync(int categoryId);
        Task<TaskItemResponseDto?> GetTaskItemByIdAsync(int taskItemId);
    }
}
