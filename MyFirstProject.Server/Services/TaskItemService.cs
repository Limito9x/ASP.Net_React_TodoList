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
        public async Task<TaskItemResponseDto> CreateTaskItemAsync(CreateTaskItemDto taskItemDto)
        {
            var taskItem = taskItemDto.ToCreateModel();
            await _context.TaskItems.AddAsync(taskItem);
            await _context.SaveChangesAsync();
            return taskItem.ToDto();
        }
        public async Task<TaskItemResponseDto?> GetTaskItemByIdAsync(int taskItemId, int userId)
        {
            var taskItem = await _context.TaskItems.FindAsync(taskItemId);
            if (taskItem == null)
            {
                return null;
            }
            if(taskItem.Plan != null && taskItem.Plan.UserId != userId)
            {
                throw new UnauthorizedAccessException("You do not have access to this task.");
            }
            return taskItem?.ToDto();
        }
        public Task<List<TaskItemResponseDto>> GetTaskItemsByPlanIdAsync(int planId, int userId)
        {
            return _context.TaskItems
                .AsNoTracking()
                .Where(t => t.PlanId == planId && t.Plan.UserId == userId)
                .Select(t => t.ToDto())
                .ToListAsync();
        }

        public async Task<TaskItemResponseDto?> UpdateTaskItemByIdAsync(int taskId, UpdateTaskItemDto taskItemDto, int userId)
        {
            var existingTaskItem = await _context.TaskItems.FindAsync(taskId);
            if (existingTaskItem == null)
            {
                return null;
            }
            if (existingTaskItem.Plan != null && existingTaskItem.Plan.UserId != userId)
            {
                throw new UnauthorizedAccessException("You do not have access to update this task.");
            }
            existingTaskItem.UpdateFromDto(taskItemDto);
            await _context.SaveChangesAsync();
            return existingTaskItem.ToDto();
        }

        public async Task<bool> DeleteTaskItemByIdAsync(int taskId, int userId)
        {
            var existingTaskItem = await _context.TaskItems.FindAsync(taskId);
            if (existingTaskItem == null)
            {
                return false;
            }
            if (existingTaskItem.Plan != null && existingTaskItem.Plan.UserId != userId)
            {
                throw new UnauthorizedAccessException("You do not have access to delete this task.");
            }
            _context.TaskItems.Remove(existingTaskItem);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
