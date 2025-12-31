using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using MyFirstProject.Server.Data;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Models.Enums;
using MyFirstProject.Server.Services.AssetLink;
using MyFirstProject.Server.Services.UserService;

namespace MyFirstProject.Server.Services.Plan
{
    public interface IPlanService
    {
        Task<ResponsePlanDto> CreatePlanAsync(RequestPlanDto PlanDto);
        Task<List<ResponsePlanDto>> GetPlansByUserIdAsync();
        Task<ResponsePlanDto?> GetPlanByIdAsync(int PlanId);
        Task<ResponsePlanDto?> UpdatePlanAsync(int PlanId, RequestPlanDto PlanDto);
        Task<bool> DeletePlanAsync(int PlanId);
        Task UpdatePlanProgressAsync(int PlanId);
    }
    public class PlanService : IPlanService
    {
        private readonly ApplicationDbContext _context;
        private readonly IAssetLinkService _assetLinkService;
        private readonly ICurrentUserService _currentUserService;
        private readonly IMapper _mapper;

        public PlanService(
            ApplicationDbContext context,
            IAssetLinkService assetLinkService,
            ICurrentUserService currentUserService,
            IMapper mapper
            )
        {
            _context = context;
            _assetLinkService = assetLinkService;
            _currentUserService = currentUserService;
            _mapper = mapper;
        }

        public async Task<ResponsePlanDto> CreatePlanAsync(RequestPlanDto PlanDto)
        {
            var userId = _currentUserService.UserId;

            // Map DTO to Model
            var Plan = _mapper.Map<Models.Plan>(PlanDto);
            Plan.UserId = userId;

            // Gán UserId cho tất cả Phase con nếu có
            if (Plan.Phases != null && Plan.Phases.Any())
            {
                foreach (var phase in Plan.Phases)
                {
                    phase.UserId = userId;
                }
            }
            Plan.Progress = 0;
            // Add to DB
            await _context.Plans.AddAsync(Plan);
            // Save changes
            await _context.SaveChangesAsync();
            // Return DTO
            return _mapper.Map<ResponsePlanDto>(Plan);
        }

        public async Task<ResponsePlanDto?> GetPlanByIdAsync(int PlanId)
        {
            var userId = _currentUserService.UserId;
            var Plan = await _context.Plans
                .Include(p => p.Phases)
                .FirstOrDefaultAsync(p => p.Id == PlanId);
            if (Plan == null) return null;
            _currentUserService.CheckAuthorized(Plan.UserId, nameof(Models.Plan));
            return _mapper.Map<ResponsePlanDto>(Plan);
        }

        public async Task<List<ResponsePlanDto>> GetPlansByUserIdAsync()
        {
            var userId = _currentUserService.UserId;
            var plans = await _context.Plans
                .Include(p => p.Phases)
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.StartDate)
                .ToListAsync();

            return _mapper.Map<List<ResponsePlanDto>>(plans);
        }

        public async Task<ResponsePlanDto?> UpdatePlanAsync(int PlanId, RequestPlanDto PlanDto)
        {
            var userId = _currentUserService.UserId;
            var plan = await _context.Plans.FindAsync(PlanId);
            if (plan == null) return null;
            _mapper.Map(PlanDto, plan);
            await _context.SaveChangesAsync();
            return _mapper.Map<ResponsePlanDto>(plan);
        }

        public async Task<bool> DeletePlanAsync(int PlanId)
        {
            var userId = _currentUserService.UserId;
            var Plan = await _context.Plans.FirstOrDefaultAsync(p => p.Id == PlanId);
            if (Plan == null) return false;
            await _assetLinkService.RemoveAssetLinkByAsync(PlanId, AssetLinkType.PLAN);
            _context.Plans.Remove(Plan);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task UpdatePlanProgressAsync(int PlanId)
        {
            var plan = await _context.Plans
                .Include(p => p.Phases)
                .FirstOrDefaultAsync(p => p.Id == PlanId);
            if (plan == null) return;
            plan.Progress = plan.Phases != null && plan.Phases.Any()
                ? plan.Phases.Average(phase => phase.Progress ?? 0)
                : 0;
            await _context.SaveChangesAsync();
        }
    }
}