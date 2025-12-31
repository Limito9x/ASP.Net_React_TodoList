using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using MyFirstProject.Server.Data;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Helpers;
using MyFirstProject.Server.Models;
using MyFirstProject.Server.Services.TaskLog;
using MyFirstProject.Server.Services.UserService;

namespace MyFirstProject.Server.Services.Routine
{
    public interface IRoutineService
    {
        Task<ResponseRoutineDto> CreateRoutineAsync(RequestRoutineDto routineDto);
        Task<ResponseRoutineDto?> GetRoutineByIdAsync(int routineId);
        Task<List<SimpleResponseRoutineDto>> GetRoutinesByUserIdAsync();
        Task<ResponseRoutineDto?> UpdateRoutineAsync(int routineId, RequestRoutineDto routineDto);
        Task<ResponseRoutineDto?> CheckinRoutineAsync(int routineId, CheckinRoutineDto routineDto);
        Task<bool> DeleteRoutineAsync(int routineId);
    }
    public class RoutineService: IRoutineService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;
        private readonly IMapper _mapper;
        private readonly ITaskLogService _taskLogService;

        public RoutineService(ApplicationDbContext context, ICurrentUserService currentUserService, IMapper mapper, ITaskLogService taskLogService)
        {
            _context = context;
            _currentUserService = currentUserService;
            _mapper = mapper;
            _taskLogService = taskLogService;
        }
        private async Task<int> CalculateNewExpectedTotalCount(int routineId, RecurrenceRule newRule)
        {
            var today = DateTime.UtcNow.Date;

            // Bước 1: Lấy số lượng TaskLog ĐÃ PHÁT SINH trong quá khứ (trước hôm nay)
            // Bao gồm cả Success, Failed, Skipped vì chúng đại diện cho "phiên đã qua"
            var pastLogsCount = await _context.TaskLogs
                .CountAsync(l => l.RoutineId == routineId && l.CreatedAt < today);

            // Bước 2: Tìm đối tượng Routine để lấy thông tin EndDate
            var routine = await _context.Routines
                .Include(r => r.Phase)
                .FirstOrDefaultAsync(r => r.Id == routineId);

            if (routine == null) return 0;

            // Bước 3: Tính toán mẫu số cho tương lai (từ hôm nay đến khi kết thúc)
            // Chúng ta dùng Rule mới cho giai đoạn này
            var searchEnd = routine.EndDate ?? routine.Phase.EndDate;

            // Gọi hàm IcalHelper đã viết ở câu trước
            // Mốc bắt đầu tìm kiếm là 'today' (để áp dụng rule mới ngay từ hôm nay)
            var futureOccurrences = IcalHelper.GetOccurrences(today, searchEnd, newRule);

            // Bước 4: Tổng mẫu số mới = Thực tế quá khứ + Ước lượng tương lai
            return pastLogsCount + futureOccurrences.Count;
        }
        public async Task<ResponseRoutineDto> CreateRoutineAsync(RequestRoutineDto routineDto)
        {
            try
            {
                var userId = _currentUserService.UserId;
                var routine = _mapper.Map<Models.Routine>(routineDto);
                routine.UserId = userId;

                // ✅ Tính ExpectedTotalCount nếu có PhaseId hoặc EndDate
                if (routineDto.PhaseId.HasValue || routineDto.EndDate.HasValue)
                {
                    var phase = routineDto.PhaseId.HasValue 
                        ? await _context.Phases.FindAsync(routineDto.PhaseId.Value)
                        : null;

                    var endDate = routineDto.EndDate ?? phase?.EndDate;
                    
                    if (endDate.HasValue)
                    {
                        var startDate = routineDto.StartDate ?? DateTime.UtcNow;
                        routine.ExpectedTotalCount = RoutineHelper.CalculateTotalOccurrences(
                            startDate,
                            endDate,
                            routineDto.Rule
                        );
                    }
                }

                _context.Routines.Add(routine);
                await _context.SaveChangesAsync();
                
                return _mapper.Map<ResponseRoutineDto>(routine);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[RoutineService] Error creating routine: {ex.Message}");
                Console.WriteLine($"[RoutineService] Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        public async Task<ResponseRoutineDto?> GetRoutineByIdAsync(int routineId)
        {
            var routine = await _context.Routines
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Id == routineId);
            if (routine == null) return null;
            return _mapper.Map<ResponseRoutineDto>(routine);
        }
        
        public async Task<List<SimpleResponseRoutineDto>> GetRoutinesByUserIdAsync()
        {
            var userId = _currentUserService.UserId;
            var routines = await _context.Routines
                .AsNoTracking()
                .Where(r => r.UserId == userId)
                .ToListAsync();
            return _mapper.Map<List<SimpleResponseRoutineDto>>(routines);
        }

        public async Task<ResponseRoutineDto?> UpdateRoutineAsync(int routineId, RequestRoutineDto routineDto)
        {
            var existingRoutine = await _context.Routines.FindAsync(routineId);
            if (existingRoutine == null) return null;
            _mapper.Map(routineDto, existingRoutine);
            // Cập nhật lại ExpectedTotalCount nếu Rule thay đổi
            if (existingRoutine.Rule != routineDto.Rule)
            {
                existingRoutine.ExpectedTotalCount = await CalculateNewExpectedTotalCount(routineId, routineDto.Rule);
            }
            await _context.SaveChangesAsync();
            return _mapper.Map<ResponseRoutineDto>(existingRoutine);
        }

        public async Task<ResponseRoutineDto?> CheckinRoutineAsync(int routineId, CheckinRoutineDto routineDto)
        {
            try
            {
                var existingRoutine = await _context.Routines.FindAsync(routineId);
                if (existingRoutine == null) return null;

                // Tạo TaskLog mới
                var taskLogDto = new RequestTaskLogDto(
                    routineDto.Note,
                    routineDto.Outcome,
                    routineDto.Data,
                    routineDto.Contributions,
                    routineId,
                    null,
                    existingRoutine.PhaseId
                );

                await _taskLogService.CreateTaskLogAsync(taskLogDto);

                // ✅ Cập nhật NextOccurrence
                var nextOcc = RoutineHelper.GetNextOccurrence(existingRoutine.NextOccurrence, existingRoutine.Rule);
                if (nextOcc.HasValue)
                {
                    existingRoutine.NextOccurrence = nextOcc.Value;
                }
                else
                {
                    // Nếu không còn occurrence nào (hết hạn), giữ nguyên
                    Console.WriteLine($"[RoutineService] Routine {routineId} has no more occurrences");
                }

                await _context.SaveChangesAsync();
                return _mapper.Map<ResponseRoutineDto>(existingRoutine);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[RoutineService] Error checking in routine: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> DeleteRoutineAsync(int routineId)
        {
            var existingRoutine = await _context.Routines.FindAsync(routineId);
            if (existingRoutine == null) return false;
            _context.Routines.Remove(existingRoutine);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
