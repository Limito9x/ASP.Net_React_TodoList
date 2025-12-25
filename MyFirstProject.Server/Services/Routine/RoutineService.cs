using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using MyFirstProject.Server.Data;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Services.UserService;

namespace MyFirstProject.Server.Services.Routine
{
    public interface IRoutineService
    {
        Task<ResponseRoutineDto> CreateRoutineAsync(RequestRoutineDto routineDto);
        Task<ResponseRoutineDto?> GetRoutineByIdAsync(int routineId);
        Task<List<SimpleResponseRoutineDto>> GetRoutinesByUserIdAsync();
        Task<ResponseRoutineDto?> UpdateRoutineAsync(int routineId, RequestRoutineDto routineDto);
        Task<bool> DeleteRoutineAsync(int routineId);
    }
    public class RoutineService: IRoutineService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;
        private readonly IMapper _mapper;
        public RoutineService(ApplicationDbContext context, ICurrentUserService currentUserService, IMapper mapper)
        {
            _context = context;
            _currentUserService = currentUserService;
            _mapper = mapper;
        }
        public async Task<ResponseRoutineDto> CreateRoutineAsync(RequestRoutineDto routineDto)
        {
            var userId = _currentUserService.UserId;
            var routine = _mapper.Map<Models.Routine>(routineDto);
            routine.UserId = userId;
            _context.Routines.Add(routine);
            await  _context.SaveChangesAsync();
            return _mapper.Map<ResponseRoutineDto>(routine);
        }

        public async Task<ResponseRoutineDto?> GetRoutineByIdAsync(int routineId)
        {
            var routine = await _context.Routines.FindAsync(routineId);
            if (routine == null) return null;
            return _mapper.Map<ResponseRoutineDto>(routine);
        }
        public async Task<List<SimpleResponseRoutineDto>> GetRoutinesByUserIdAsync()
        {
            var userId = _currentUserService.UserId;
            var routines = await _context.Routines
                .AsNoTracking()
                .Where(r => r.UserId == userId).ToListAsync();
            return _mapper.Map<List<SimpleResponseRoutineDto>>(routines);
        }

        public async Task<List<ResponseRoutineDto>> GetRoutineByPhaseIdAsync(int phaseId)
        {
            var routine = await _context.Routines
                .AsNoTracking()
                .Where(r => r.PhaseId == phaseId)
                .ToListAsync();
            return _mapper.Map<List<ResponseRoutineDto>>(routine);
        }

        public async Task<ResponseRoutineDto?> UpdateRoutineAsync(int routineId, RequestRoutineDto routineDto)
        {
            var existingRoutine = await _context.Routines.FindAsync(routineId);
            if (existingRoutine == null) return null;
            _mapper.Map(routineDto, existingRoutine);
            await _context.SaveChangesAsync();
            return _mapper.Map<ResponseRoutineDto>(existingRoutine);
        }

        public async Task<bool> DeleteRoutineAsync(int routineId)
        {
            var existingRoutine = await _context.Routines
                .FindAsync(routineId);
            if (existingRoutine == null) return false;
            _context.Routines.Remove(existingRoutine);
            _context.SaveChanges();
            return true;
        }
    }
}
