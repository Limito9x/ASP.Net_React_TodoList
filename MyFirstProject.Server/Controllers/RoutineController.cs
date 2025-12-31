using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Services.Routine;

namespace MyFirstProject.Server.Controllers
{
    [ApiController]
    [Route("api/routines")]
    [Authorize]
    public class RoutineController : ControllerBase
    {
        private readonly IRoutineService _routineService;
        public RoutineController(IRoutineService routineService)
        {
            _routineService = routineService;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseRoutineDto>> GetRoutineById(int id)
        {
            try
            {
                var routine = await _routineService.GetRoutineByIdAsync(id);
                if (routine == null)
                {
                    return NotFound();
                }
                return Ok(routine);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<ActionResult<List<ResponseRoutineDto>>> GetAllRoutines()
        {
            try
            {
                var routines = await _routineService.GetRoutinesByUserIdAsync();
                return Ok(routines);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<ResponseRoutineDto>> CreateRoutine([FromBody] RequestRoutineDto routineDto)
        {
            try
            {
                Console.WriteLine("Creating routine with name: " + routineDto);
                var createdRoutine = await _routineService.CreateRoutineAsync(routineDto);
                return Ok(createdRoutine);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error creating routine: " + ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{id}/checkin")]
        public async Task<ActionResult<ResponseRoutineDto>> CheckInRoutine(int id, [FromBody] CheckinRoutineDto checkinRoutineDto)
        {
            try
            {
                var checkedInRoutine = await _routineService.CheckinRoutineAsync(id, checkinRoutineDto);
                if (checkedInRoutine == null)
                {
                    return NotFound();
                }
                return Ok(checkedInRoutine);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<ResponseRoutineDto>> UpdateRoutine(int id, [FromBody] RequestRoutineDto routineDto)
        {
            try
            {
                var updatedRoutine = await _routineService.UpdateRoutineAsync(id, routineDto);
                if (updatedRoutine == null)
                {
                    return NotFound();
                }
                return Ok(updatedRoutine);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteRoutine(int id)
        {
            try
            {
                var deleted = await _routineService.DeleteRoutineAsync(id);
                if (!deleted)
                {
                    return NotFound();
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

