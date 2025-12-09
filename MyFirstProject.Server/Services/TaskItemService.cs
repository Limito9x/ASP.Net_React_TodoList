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
    }
}
