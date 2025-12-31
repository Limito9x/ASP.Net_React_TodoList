using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using MyFirstProject.Server.Data;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Models;
using MyFirstProject.Server.Models.Enums;
using MyFirstProject.Server.Services.AssetLink;
using MyFirstProject.Server.Services.Plan;
using MyFirstProject.Server.Services.UserService;

namespace MyFirstProject.Server.Services.Phase
{
    public interface IPhaseService
    {

        Task<ResponsePhaseDto?> GetPhaseByIdAsync(int phaseId);
        Task<ResponsePhaseDto> CreatePhaseAsync(RequestPhaseDto phaseDto);
        Task<ResponsePhaseDto?> UpdatePhaseAsync(int phaseId, RequestPhaseDto phaseDto);
        Task<bool> DeletePhaseAsync(int phaseId);
        Task UpdatePhaseProgressAsync(int phaseId);
        decimal CalculateOverallProgress(Models.Phase phase);
        Task UpdateGoalValuesAsync(int phaseId, List<Contribution> contributions);
    }
    public class PhaseService: IPhaseService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;
        private readonly IAssetLinkService _assetLinkService;
        private readonly IMapper _mapper;
        private readonly IPlanService _planService;

        public PhaseService(
            ApplicationDbContext context,
            ICurrentUserService currentUserService,
            IAssetLinkService assetLinkService,
            IMapper mapper,
            IPlanService planService
            )
        {
            _context = context;
            _currentUserService = currentUserService;
            _assetLinkService = assetLinkService;
            _mapper = mapper;
            _planService = planService;
        }

        public async Task<ResponsePhaseDto?> GetPhaseByIdAsync(int phaseId)
        {
            var phase = await _context.Phases
                .Include(ph => ph.SingleTasks)
                .Include(ph => ph.Routines)
                .AsNoTracking()
                .FirstOrDefaultAsync(ph => ph.Id == phaseId);
            
            if(phase == null) return null;
            return _mapper.Map<ResponsePhaseDto>(phase);
        }

        public async Task<ResponsePhaseDto> CreatePhaseAsync(RequestPhaseDto phaseDto)
        {
            var userId = _currentUserService.UserId;
            var phase = _mapper.Map<Models.Phase>(phaseDto);
            phase.UserId = userId;
            phase.Progress = 0;
            _context.Phases.Add(phase);
            await  _context.SaveChangesAsync();
            return _mapper.Map<ResponsePhaseDto>(phase);
        }

        public async Task<ResponsePhaseDto?> UpdatePhaseAsync(int phaseId, RequestPhaseDto phaseDto)
        {
            var existingPhase = await _context.Phases.FindAsync(phaseId);
            if(existingPhase == null) return null;
            _mapper.Map(phaseDto, existingPhase);
            await _context.SaveChangesAsync();
            return _mapper.Map<ResponsePhaseDto>(existingPhase);
        }

        public async Task<bool> DeletePhaseAsync(int phaseId)
        {
            var existingPhase = await _context.Phases.FindAsync(phaseId);
            if(existingPhase == null) return false;
            _context.Remove(existingPhase);
            await _assetLinkService.RemoveAssetLinkByAsync(phaseId, Models.Enums.AssetLinkType.PHASE);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task UpdatePhaseProgressAsync(int phaseId)
        {
            _context.ChangeTracker.Clear();
            var phase = await _context.Phases
                .Include(ph => ph.SingleTasks)
                .Include(ph => ph.Routines)
                .Include(ph => ph.TaskLogs)
                .FirstOrDefaultAsync(ph => ph.Id == phaseId);
            if (phase == null) return;
            phase.Progress = CalculateOverallProgress(phase);
            _context.Phases.Update(phase);
            await _context.SaveChangesAsync();
            await _planService.UpdatePlanProgressAsync(phase.PlanId);
        }

        public decimal CalculateOverallProgress(Models.Phase phase)
        {
            // 1. Nếu có cấu hình mục tiêu số liệu -> Ưu tiên tính theo số liệu
            if (phase.Goals != null && phase.Goals.Any())
            {
                return (decimal)phase.Goals.Average(g => {
                    double totalDistance = Math.Abs(g.Target - g.Start);
                    if (totalDistance < 0.000001) return g.Current >= g.Target ? 100 : 0;

                    double achievedDistance = Math.Abs(g.Current - g.Start);
                    return Math.Clamp((achievedDistance / totalDistance) * 100, 0, 100);
                });
            }
            // 2. Nếu không có cấu hình mục tiêu số liệu -> Tính theo tiến độ công việc
            int totalSingleTasks = phase.SingleTasks?.Count(t => t.Status != SingleTaskStatus.Cancelled) ?? 0;
            int totalExpectedRoutines = phase.Routines?.Sum(r => r.ExpectedTotalCount) ?? 0;
            int totalDenominator = totalSingleTasks + totalExpectedRoutines;
            if (totalDenominator == 0) return 0;

            int doneSingleTasks = phase.SingleTasks?.Count(t => t.Status == SingleTaskStatus.Completed) ?? 0;

            // B. Lấy số phiên Routine đã thực hiện thành công
            // Chúng ta lấy từ bảng TaskLogs, lọc những cái thuộc về Routine và có kết quả tốt
            int doneRoutineSessions = phase.TaskLogs?.Count(l =>
                l.RoutineId != null &&
                (l.Status == TaskLogStatus.Success || l.Status == TaskLogStatus.Partial)
            ) ?? 0;

            int totalNumerator = doneSingleTasks + doneRoutineSessions;

            // Tính toán kết quả cuối cùng
            decimal progress = (decimal)totalNumerator * 100 / totalDenominator;

            Console.WriteLine($"[Debug] PhaseId: {phase.Id}, TotalSingleTasks: {totalSingleTasks}, TotalExpectedRoutines: {totalExpectedRoutines}, DoneSingleTasks: {doneSingleTasks}, DoneRoutineSessions: {doneRoutineSessions}, Progress: {progress}");

            return Math.Clamp(progress, 0, 100);
        }
        public async Task UpdateGoalValuesAsync(int phaseId, List<Contribution> contributions)
        {
            Console.WriteLine($"[Debug] Updating goals for PhaseId: {phaseId} with {contributions.Count} contributions.");
            var phase = await _context.Phases.FindAsync(phaseId);
            if (phase == null || phase.Goals == null) return;

            bool isChanged = false;

            foreach (var cont in contributions)
            {
                var goal = phase.Goals.FirstOrDefault(g => g.Id == cont.GoalId);
                if (goal != null)
                {
                    // Cập nhật giá trị
                    if (goal.Type == UpdateStrategy.Absolute) // Lưu ý: Check đúng tên Enum trong Model của em
                        goal.Current = cont.ActualValue;
                    else
                        goal.Current += cont.ActualValue;

                    isChanged = true;
                }
            }

            if (isChanged)
            {
                // QUAN TRỌNG: Báo cho EF Core biết cột này đã bị sửa
                // Nếu không có dòng này, EF Core sẽ bỏ qua không lưu JSONB xuống DB
                _context.Entry(phase).Property(p => p.Goals).IsModified = true;
            }
            // Không cần SaveChanges ở đây nếu gọi chung trong 1 Scope, 
            // nhưng để an toàn nên Save hoặc để hàm UpdatePhaseProgress lo việc Save sau cùng.
        }
    }
}
