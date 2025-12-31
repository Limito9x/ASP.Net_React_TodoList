using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using MyFirstProject.Server.Data;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Services.AssetLink;
using MyFirstProject.Server.Services.Phase;
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
        private readonly IPhaseService _phaseService;
        public TaskLogService(
            ApplicationDbContext context,
            IMapper mapper,
            ICurrentUserService currentUserService,
            IAssetLinkService assetLinkService,
            IPhaseService phaseService
            )
        {
            _context = context;
            _mapper = mapper;
            _currentUserService = currentUserService;
            _assetLinkService = assetLinkService;
            _phaseService = phaseService;
        }
        public async Task<TaskLogDto?> GetTaskLogByIdAsync(int taskId)
        {
            var tasklog = await _context.TaskLogs
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == taskId);
            if (tasklog == null)
            {
                return null;
            }
            return _mapper.Map<TaskLogDto>(tasklog);
        }
        public async Task<TaskLogDto> CreateTaskLogAsync(RequestTaskLogDto taskLogDto)
        {
            var tasklog = _mapper.Map<Models.TaskLog>(taskLogDto);
            tasklog.CompletedAt = DateTime.UtcNow;
            _context.TaskLogs.Add(tasklog);
            // Nếu Log có đóng góp vào Goal
            Console.WriteLine("Creating TaskLog with PhaseId: " + taskLogDto);
            if (taskLogDto.Contributions != null && taskLogDto.Contributions.Any() && taskLogDto.PhaseId.HasValue)
            {
                await _phaseService.UpdateGoalValuesAsync(taskLogDto.PhaseId.Value, taskLogDto.Contributions);
            }
            await _context.SaveChangesAsync();
            if(taskLogDto.PhaseId.HasValue)
            {
                await _phaseService.UpdatePhaseProgressAsync((int)taskLogDto.PhaseId);
            }
            return _mapper.Map<TaskLogDto>(tasklog);
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
            return _mapper.Map<TaskLogDto>(existingTaskLog);
        }
        public async Task<bool> DeleteTaskLogAsync(int taskLogId)
        {
            var tasklog = await _context.TaskLogs.FindAsync(taskLogId);
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
