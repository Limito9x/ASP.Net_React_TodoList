using MapsterMapper;
using MyFirstProject.Server.Data;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Services.UserService;
using MyFirstProject.Server.Models.Enums;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace MyFirstProject.Server.Services.Schedule
{
    public interface IScheduleService
    {
        public Task<List<ScheduleTodayDto>> GetTodayTaskAsync();
    }
    public class ScheduleService : IScheduleService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;
        private readonly IMapper _mapper;
        public ScheduleService(
            ApplicationDbContext context,
            ICurrentUserService currentUserService,
            IMapper mapper
            )
        {
            _context = context;
            _currentUserService = currentUserService;
            _mapper = mapper;
        }

        public async Task<List<ScheduleTodayDto>> GetTodayTaskAsync()
        {
            var userId = _currentUserService.UserId;
            var today = DateTime.UtcNow.Date;

            var tasks = await _context.SingleTasks
                .Where(t => t.UserId == userId && (t.Status != SingleTaskStatus.Completed || t.Status != SingleTaskStatus.Archived))
                .Where(t => t.DueDate.Value.Date <= today || (t.StartAt.Value.Date <= today && t.EndAt.Value.Date >= today))
                .ProjectToType<ScheduleTodayDto>(_mapper.Config)
                .ToListAsync();

            var routines = await _context.Routines
                .Where(r => r.UserId == userId)
                .Where(r => r.NextOccurrence.Date <= today)
                .ProjectToType<ScheduleTodayDto>(_mapper.Config)
                .ToListAsync();

            var schedule = tasks.Concat(routines).OrderBy(x => x.StartAt).ToList();
            return schedule;
        }
    }
}
