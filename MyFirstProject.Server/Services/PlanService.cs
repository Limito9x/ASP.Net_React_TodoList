using Microsoft.EntityFrameworkCore;
using MyFirstProject.Server.Data;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Mappers;

namespace MyFirstProject.Server.Services
{
    public class PlanService : IPlanService
    {
        private readonly ApplicationDbContext _context;

        public PlanService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PlanResponseDto> CreatePlanAsync(CreatePlanDto PlanDto, int userId)
        {
            // B1. Mapper DTO sang Model
            var Plan = PlanDto.ToCreateModel(userId);
            // B2. Thêm vào CSDL
            await _context.Plans.AddAsync(Plan);
            // B3. Lưu thay đổi
            await _context.SaveChangesAsync();
            // B4. Trả về DTO
            return Plan.ToDto();
        }

        public async Task<PlanResponseDto?> GetPlanByIdAsync(int PlanId, int userId)
        {
            var Plan = await _context.Plans.FindAsync(PlanId);
            if (Plan == null) { 
                throw new KeyNotFoundException("Plan not found");
            }
            if(Plan.UserId != userId)
            {
                throw new UnauthorizedAccessException("You do not have access to this Plan");
            }
            return Plan?.ToDto();
        }

        public async Task<List<PlanResponseDto>> GetPlansByUserIdAsync(int userId)
        {
            var plans = await _context.Plans
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.StartDate)
                .Select(p => p.ToDto())
                .ToListAsync();

            return plans;
        }

        public async Task<PlanResponseDto> UpdatePlanAsync(int PlanId, UpdatePlanDto PlanDto, int userId)
        {
            var plan = await _context.Plans.FindAsync(PlanId);
            if (plan == null)
            {
                throw new KeyNotFoundException("Plan not found");
            }
            if (plan.UserId != userId)
            {
                throw new UnauthorizedAccessException("You do not have access to this Plan");
            }
            plan.UpdateFromDto(PlanDto);
            // Lưu thay đổi
            await _context.SaveChangesAsync();
            return plan.ToDto();
        }

        public async Task<bool> DeletePlanAsync(int PlanId, int userId)
        {
            var Plan = await _context.Plans.Include(p=>p.Assets).FirstOrDefaultAsync(p=>p.Id==PlanId);
            if (Plan == null)
            {
                return false;
            }
            if (Plan.UserId != userId)
            {
                throw new UnauthorizedAccessException("You do not have access to this Plan");
            }
            _context.Plans.Remove(Plan);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
