using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using MyFirstProject.Server.Data;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Services.AssetLink;
using MyFirstProject.Server.Services.UserService;


namespace MyFirstProject.Server.Services.TaskLog
{
    public interface ITaskLogService
    {
        Task<TaskLogDto?> GetTaskLogByIdAsync(int taskId);
        Task<TaskLogDto> CreateTaskLogAsync(RequestTaskLogDto taskLogDto);
        Task<TaskLogDto?> UpdateTaskLogAsync(int taskLogId, RequestTaskLogDto taskLogDto);
        Task<bool> DeleteTaskLogAsync(int taskLogId);
    }
    public class TaskLogService: ITaskLogService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _currentUserService;
        private readonly IAssetLinkService _assetLinkService;
        public TaskLogService(ApplicationDbContext context, IMapper mapper, ICurrentUserService currentUserService, IAssetLinkService assetLinkService)
        {
            _context = context;
            _mapper = mapper;
            _currentUserService = currentUserService;
            _assetLinkService = assetLinkService;
        }
        public async Task<TaskLogDto?> GetTaskLogByIdAsync(int taskId)
        {
            var tasklog = await _context.TaskLogs.FindAsync(taskId);
            if (tasklog == null)
            {
                return null;
            }
            var tasklogDto = _mapper.Map<TaskLogDto>(tasklog);
            return tasklogDto;
        }
        public async Task<TaskLogDto> CreateTaskLogAsync(RequestTaskLogDto taskLogDto)
        {
            var tasklog = _mapper.Map<Models.TaskLog>(taskLogDto);
            _context.TaskLogs.Add(tasklog);
            await _context.SaveChangesAsync();
            var createdTaskLogDto = _mapper.Map<TaskLogDto>(tasklog);
            return createdTaskLogDto;
        }
        public async Task<TaskLogDto?> UpdateTaskLogAsync(int taskLogId, RequestTaskLogDto taskLogDto)
        {
            var existingTaskLog = await _context.TaskLogs.FindAsync(taskLogId);
            if (existingTaskLog == null)
            {
                return null;
            }
            _mapper.Map(taskLogDto, existingTaskLog);
            await _context.SaveChangesAsync();
            var updatedTaskLogDto = _mapper.Map<TaskLogDto>(existingTaskLog);
            return updatedTaskLogDto;
        }
        public async Task<bool> DeleteTaskLogAsync(int taskLogId)
        {
            var tasklog = _context.TaskLogs.Find(taskLogId);
            if(tasklog == null)
            {
                return false;
            }
            _context.TaskLogs.Remove(tasklog);
            await _assetLinkService.RemoveAssetLinkByAsync(taskLogId, Models.Enums.AssetLinkType.TASK_LOG);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
