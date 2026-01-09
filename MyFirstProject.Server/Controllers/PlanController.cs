using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Services.AI;
using MyFirstProject.Server.Services.Plan;

namespace MyFirstProject.Server.Controllers
{
    [ApiController]
    [Route("api/plans")]
    [Authorize]
    public class PlanController : ControllerBase
    {
        private readonly IPlanService _PlanService;
        private readonly IAIService _aiService;

        public PlanController(IPlanService PlanService, IAIService aiService)
        {
            _PlanService = PlanService;
            _aiService = aiService;
        }

        [HttpPost]
        public async Task<ActionResult<ResponsePlanDto>> CreatePlan([FromBody] RequestPlanDto PlanDto)
        {
            try
            {
                var createdPlan = await _PlanService.CreatePlanAsync(PlanDto);
                return Ok(createdPlan);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult<List<ResponsePlanDto>>> GetPlans()
        {
            try
            {
                var plans = await _PlanService.GetPlansByUserIdAsync();
                return Ok(plans);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{PlanId}")]
        public async Task<ActionResult<ResponsePlanDto>> GetPlanById(int PlanId)
        {
            try
            {
                var Plan = await _PlanService.GetPlanByIdAsync(PlanId);
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
        public async Task<ActionResult<ResponsePlanDto>> UpdatePlan(int PlanId, [FromBody] UpdatePlanDto PlanDto)
        {
            try
            {
                var updatedPlan = await _PlanService.UpdatePlanAsync(PlanId, PlanDto);
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
                var result = await _PlanService.DeletePlanAsync(PlanId);
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

        [HttpPost("suggest")]
        public async Task<IActionResult> GetPlanSuggestion([FromBody] SuggestPlanDto suggestionDto)
        {
            try
            {
                var planSuggestion = await _aiService.GeneratePlanJSONAsync(suggestionDto.Prompt);
                return Ok(planSuggestion);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
