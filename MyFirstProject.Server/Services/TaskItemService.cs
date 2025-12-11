using Microsoft.EntityFrameworkCore;
using MyFirstProject.Server.Data;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Mappers;

namespace MyFirstProject.Server.Services
{
    public class TaskItemService: ITaskItemSerivce
    {
        private readonly ApplicationDbContext _context;

        public TaskItemService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<TaskItemResponseDto> CreateTaskItemAsync(TaskItemDto taskItemDto)
        {
            var taskItem = taskItemDto.ToModel();
            await _context.TaskItems.AddAsync(taskItem);
            await _context.SaveChangesAsync();
            return taskItem.ToDto();
        }
        public async Task<TaskItemResponseDto?> GetTaskItemByIdAsync(int taskItemId)
        {
            var taskItem = await _context.TaskItems.FindAsync(taskItemId);
            return taskItem?.ToDto();
        }
        public Task<List<TaskItemResponseDto>> GetTaskItemsByCategoryIdAsync(int categoryId)
        {
            return _context.TaskItems
                .AsNoTracking()
                .Where(t => t.CategoryId == categoryId)
                .Select(t => t.ToDto())
                .ToListAsync();
        }

        public async Task<TaskItemResponseDto?> UpdateTaskItemByIdAsync(int taskId, TaskItemDto taskItemDto)
        {
            var existingTaskItem = await _context.TaskItems.FindAsync(taskId);
            if (existingTaskItem == null)
            {
                return null;
            }
            existingTaskItem.Name = taskItemDto.Name;
            existingTaskItem.Description = taskItemDto.Description;
            existingTaskItem.DueDate = taskItemDto.DueDate;
            existingTaskItem.Status = taskItemDto.Status;
            await _context.SaveChangesAsync();
            return existingTaskItem.ToDto();
        }

        public async Task<bool> DeleteTaskItemByIdAsync(int taskId)
        {
            var existingTaskItem = await _context.TaskItems.FindAsync(taskId);
            if (existingTaskItem == null)
            {
                return false;
            }
            _context.TaskItems.Remove(existingTaskItem);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
