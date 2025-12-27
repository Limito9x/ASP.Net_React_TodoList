using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using MyFirstProject.Server.Data;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Services.UserService;

namespace MyFirstProject.Server.Services.Form
{
    public interface IFormService
    {
        Task<List<ResponseFormDto>> GetAllFormsAsync(RequestQueryFormDto queryDto);
        Task<ResponseFormDto> CreateFormAsync(RequestFormDto formDto);
        Task<bool> DeleteFormAsync(int formId);
        Task<bool> ValidateFormsAsync(List<int> formIds, int userId);
    }
    public class FormService : IFormService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;
        private readonly IMapper _mapper;

        public FormService(ApplicationDbContext context, ICurrentUserService currentUserService, IMapper mapper)
        {
            _context = context;
            _currentUserService = currentUserService;
            _mapper = mapper;
        }

        public async Task<List<ResponseFormDto>> GetAllFormsAsync(RequestQueryFormDto queryDto)
        {
            var userId = _currentUserService.UserId;
            var formIds = queryDto.FormIds;
            var forms = await _context.Forms
                .AsNoTracking()
                .Where(f => f.UserId == userId && (formIds == null || formIds.Contains(f.Id)))
                .ToListAsync();
            var formDtos = _mapper.Map<List<ResponseFormDto>>(forms);
            return formDtos;
        }

        public async Task<ResponseFormDto> CreateFormAsync(RequestFormDto formDto)
        {
            var userId = _currentUserService.UserId;
            var form = _mapper.Map<Models.Form>(formDto);
            form.UserId = userId;
            _context.Forms.Add(form);
            await _context.SaveChangesAsync();
            return _mapper.Map<ResponseFormDto>(form);
        }

        public async Task<bool> DeleteFormAsync(int formId)
        {
            var userId = _currentUserService.UserId;
            var form = await _context.Forms.FindAsync(formId);
            if (form == null || form.UserId != userId)
            {
                return false;
            }
            _currentUserService.CheckAuthorized(form.UserId, "form");
            _context.Forms.Remove(form);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ValidateFormsAsync(List<int> formIds, int userId)
        {
            // Null hoặc empty list được coi là valid (không có form nào cần validate)
            if (formIds == null || formIds.Count == 0)
            {
                return true;
            }
            
            var count = await _context.Forms
                .AsNoTracking()
                .Where(f => formIds.Contains(f.Id) && f.UserId == userId)
                .CountAsync();
            return count == formIds.Count;
        }
    }
}
