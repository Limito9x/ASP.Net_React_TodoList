using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Services;
using System.Security.Claims;

namespace MyFirstProject.Server.Controllers
{
    [ApiController]
    [Route("api/plans")]
    [Authorize]
    public class PlanController : ControllerBase
    {
        private readonly IPlanService _PlanService;

        public PlanController(IPlanService PlanService)
        {
            _PlanService = PlanService;
        }

        [HttpPost]
        public async Task<ActionResult<PlanResponseDto>> CreatePlan([FromBody] CreatePlanDto PlanDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var createdPlan = await _PlanService.CreatePlanAsync(PlanDto,userId);
                return Ok(createdPlan);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult<List<PlanResponseDto>>> GetCategories()
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var plans = await _PlanService.GetPlansByUserIdAsync(userId);
                return Ok(plans);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{PlanId}")]
        public async Task<ActionResult<PlanResponseDto>> GetPlanById(int PlanId)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var Plan = await _PlanService.GetPlanByIdAsync(PlanId,userId);
                if (Plan == null)
                {
                    return NotFound();
                }
                return Ok(Plan);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{PlanId}")]
        public async Task<ActionResult<PlanResponseDto>> UpdatePlan(int PlanId, [FromBody] UpdatePlanDto PlanDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var updatedPlan = await _PlanService.UpdatePlanAsync(PlanId, PlanDto, userId);
                return Ok(updatedPlan);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{PlanId}")]
        public async Task<ActionResult> DeletePlan(int PlanId)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var result = await _PlanService.DeletePlanAsync(PlanId, userId);
                if (!result)
                {
                    return NotFound();
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
