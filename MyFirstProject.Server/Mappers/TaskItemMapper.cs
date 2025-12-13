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
                DueDate = taskItem.DueDate,
                CompletedAt = taskItem.CompletedAt,
            };
        }
        public static TaskItem ToCreateModel(this CreateTaskItemDto TaskItemDto)
        {
            return new TaskItem
            {
                Name = TaskItemDto.Name,
                Description = TaskItemDto.Description,
                DueDate = TaskItemDto.DueDate,
                PlanId = TaskItemDto.PlanId,
            };
        }

        public static void UpdateFromDto(this TaskItem existingTask, UpdateTaskItemDto dto)
        {
            existingTask.Name = dto.Name;
            existingTask.Description = dto.Description;
            existingTask.UpdatedAt = DateTime.UtcNow;
            existingTask.DueDate = dto.DueDate;
            existingTask.Status = dto.Status;
        }
    }
}
