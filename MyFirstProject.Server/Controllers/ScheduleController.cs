using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Services.Schedule;

namespace MyFirstProject.Server.Controllers
{
    [ApiController]
    [Route("api/schedules")]
    [Authorize]
    public class ScheduleController: ControllerBase
    {
        private readonly IScheduleService _scheduleService;
        public ScheduleController(IScheduleService scheduleService)
        {
            _scheduleService = scheduleService;
        }
        [HttpGet("today")]
        public async Task<ActionResult<List<ScheduleTodayDto>>> GetTodayTasks()
        {
            try
            {
                var todayTasks = await _scheduleService.GetTodayTaskAsync();
                return new OkObjectResult(todayTasks);
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex.Message);
            }
        }
    }
}
