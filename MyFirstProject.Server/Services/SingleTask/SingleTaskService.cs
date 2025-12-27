using Microsoft.EntityFrameworkCore;
using MyFirstProject.Server.Data;
using MyFirstProject.Server.Services.AssetLink;
using MyFirstProject.Server.Models.Enums;
using MyFirstProject.Server.Services.UserService;
using MyFirstProject.Server.Dtos;
using MapsterMapper;
using MyFirstProject.Server.Services.Form;

namespace MyFirstProject.Server.Services.SingleTask
{
    public interface ISingleTaskService
    {
        Task<ResponseSingleTaskDto> CreateSingleTaskAsync(RequestSingleTaskDto taskItemDto);
        Task<ResponseSingleTaskDto> GetSingleTaskByIdAsync(int taskId);
        Task<ResponseSingleTaskDto> UpdateSingleTaskByIdAsync(int taskId, RequestSingleTaskDto taskItemDto);
        Task<ResponseSingleTaskDto?> ExecuteSingleTaskByIdAsync(int taskId, ExecuteSingleTaskDto singleTaskDto);
        Task<bool> DeleteSingleTaskByIdAsync(int taskId);
    }
    public class SingleTaskService: ISingleTaskService
    {
        private readonly ApplicationDbContext _context;
        private readonly IAssetLinkService _assetLinkService;
        private readonly ICurrentUserService _currentUserService;
        private readonly IFormService _formService;
        private readonly IMapper _mapper;

        public SingleTaskService(
            ApplicationDbContext context,
            IAssetLinkService assetLinkService,
            ICurrentUserService currentUserService,
            IMapper mapper,
            IFormService formService
            )
        {
            _context = context;
            _assetLinkService = assetLinkService;
            _currentUserService = currentUserService;
            _mapper = mapper;
            _formService = formService;
        }
        public async Task<ResponseSingleTaskDto> CreateSingleTaskAsync(RequestSingleTaskDto taskItemDto)
        {
            var userId = _currentUserService.UserId;
            
            // Chỉ validate khi LinkedFormIds có giá trị và không rỗng
            if (taskItemDto.LinkedFormIds?.Any() == true)
            {
                var isValidForm = await _formService.ValidateFormsAsync(taskItemDto.LinkedFormIds, userId);
                if (!isValidForm)
                {
                    throw new UnauthorizedAccessException("One or more forms are invalid or do not belong to the user.");
                }
            }
            
            var singleTask = _mapper.Map<Models.SingleTask>(taskItemDto);
            singleTask.UserId = userId;
            await _context.SingleTasks.AddAsync(singleTask);
            await _context.SaveChangesAsync();
            return _mapper.Map<ResponseSingleTaskDto>(singleTask);
        }
        public async Task<ResponseSingleTaskDto?> GetSingleTaskByIdAsync(int taskItemId)
        {
            var userId = _currentUserService.UserId;
            var taskItem = await _context.SingleTasks.FindAsync(taskItemId);
            if (taskItem == null)
            {
                return null;
            }
            if(taskItem.Phase != null && taskItem.Phase.Plan.UserId != userId)
            {
                throw new UnauthorizedAccessException("You do not have access to this task.");
            }
            return _mapper.Map<ResponseSingleTaskDto>(taskItem);
        }

        public async Task<ResponseSingleTaskDto?> UpdateSingleTaskByIdAsync(int taskId, RequestSingleTaskDto taskItemDto)
        {
            var userId = _currentUserService.UserId;
            var existingTaskItem = await _context.SingleTasks.FindAsync(taskId);
            if (existingTaskItem == null)
            {
                return null;
            }
            _mapper.Map(taskItemDto, existingTaskItem);
            await _context.SaveChangesAsync();
            return _mapper.Map<ResponseSingleTaskDto>(existingTaskItem);
        }

        public async Task<ResponseSingleTaskDto?> ExecuteSingleTaskByIdAsync(int taskId, ExecuteSingleTaskDto singleTaskDto)
        {
            var userId = _currentUserService.UserId;
            var existingTaskItem = await _context.SingleTasks.FindAsync(taskId);
            if (existingTaskItem == null)
            {
                return null;
            }
            _mapper.Map(singleTaskDto, existingTaskItem);
            await _context.SaveChangesAsync();
            return _mapper.Map<ResponseSingleTaskDto>(existingTaskItem);
        }

        public async Task<bool> DeleteSingleTaskByIdAsync(int taskId)
        {
            var userId = _currentUserService.UserId;
            var existingTaskItem = await _context.SingleTasks.FirstOrDefaultAsync(t=>t.Id==taskId);
            if (existingTaskItem == null)
            {
                return false;
            }
            await _assetLinkService.RemoveAssetLinkByAsync(taskId, AssetLinkType.SINGLE_TASK);
            _context.SingleTasks.Remove(existingTaskItem);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
