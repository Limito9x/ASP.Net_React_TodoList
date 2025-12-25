using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Services.Phase;

namespace MyFirstProject.Server.Controllers
{
    [ApiController]
    [Route("api/phases")]
    [Authorize]
    public class PhaseController : ControllerBase
    {
        private readonly IPhaseService _phaseService;
        public PhaseController(IPhaseService phaseService)
        {
            _phaseService = phaseService;
        }

        [HttpGet("{phaseId}")]
        public async Task<ActionResult<ResponsePhaseDto>> GetPhaseById(int phaseId)
        {
            try
            {
                var phase = await _phaseService.GetPhaseByIdAsync(phaseId);
                if (phase == null)
                {
                    return NotFound();
                }
                return Ok(phase);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<ResponsePhaseDto>> CreatePhase(RequestPhaseDto phaseDto)
        {
            try
            {
                var createdPhase = await _phaseService.CreatePhaseAsync(phaseDto);
                return CreatedAtAction(nameof(GetPhaseById), new { phaseId = createdPhase.Id }, createdPhase);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPatch("{phaseId}")]
        public async Task<ActionResult<ResponsePhaseDto>> UpdatePhase(int phaseId, RequestPhaseDto phaseDto)
        {
            try
            {
                var updatedPhase = await _phaseService.UpdatePhaseAsync(phaseId, phaseDto);
                if (updatedPhase == null)
                {
                    return NotFound();
                }
                return Ok(updatedPhase);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{phaseId}")]
        public async Task<IActionResult> DeletePhase(int phaseId)
        {
            try
            {
                var deleted = await _phaseService.DeletePhaseAsync(phaseId);
                if (!deleted)
                {
                    return NotFound();
                }
                return NoContent();
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
