using MyFirstProject.Server.Models;
using MyFirstProject.Server.Dtos;

namespace MyFirstProject.Server.Mappers
{
    public static class TaskItemMapper
    {
        public static TaskItemResponseDto ToDto(this TaskItem taskItem)
        {
            return new TaskItemResponseDto
            {
                Id = taskItem.Id,
                Name = taskItem.Name,
                Description = taskItem.Description,
                Status = taskItem.Status,
                CreatedAt = taskItem.CreatedAt,
                CompletedAt = taskItem.CompletedAt,
                DueDate = taskItem.DueDate,
                CategoryId = taskItem.CategoryId,
            };
        }
        public static TaskItem ToModel(this TaskItemDto TaskItemDto)
        {
            return new TaskItem
            {
                Name = TaskItemDto.Name,
                Description = TaskItemDto.Description,
                DueDate = TaskItemDto.DueDate,
                Status = TaskItemDto.Status,
                CategoryId = TaskItemDto.CategoryId,
            };
        }
    }
}
