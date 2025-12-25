using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Services.SingleTask;

namespace MyFirstProject.Server.Controllers
{
    [ApiController]
    [Route("api/single-tasks")]
    [Authorize]
    public class SingleTaskController: ControllerBase
    {
        private readonly ISingleTaskService _singleTaskService;

        public SingleTaskController(ISingleTaskService singleTaskService)
        {
            _singleTaskService = singleTaskService;
        }

        [HttpPost]
        public async Task<ActionResult<ResponseSingleTaskDto>> CreateTask([FromBody] RequestSingleTaskDto dto)
        {
            try
            {
                var created = await _singleTaskService.CreateSingleTaskAsync(dto);
                return Ok(created);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{taskId}")]
        public async Task<ActionResult<ResponseSingleTaskDto>> GetTaskById(int taskId)
        {
            try
            {
                var task = await _singleTaskService.GetSingleTaskByIdAsync(taskId);
                if (task == null)
                {
                    return NotFound();
                }
                return Ok(task);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("{taskId}")]
        public async Task<ActionResult<ResponseSingleTaskDto>> UpdateTaskById(int taskId, [FromBody] RequestSingleTaskDto dto)
        {
            try
            {
                var updated = await _singleTaskService.UpdateSingleTaskByIdAsync(taskId, dto);
                if (updated == null)
                {
                    return NotFound();
                }
                return Ok(updated);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{taskId}/execute")]
        public async Task<ActionResult<ResponseSingleTaskDto>> ExecuteTaskById(int taskId, [FromBody] ExecuteSingleTaskDto dto)
        {
            try
            {
                var executed = await _singleTaskService.ExecuteSingleTaskByIdAsync(taskId, dto);
                if (executed == null)
                {
                    return NotFound();
                }
                return Ok(executed);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{taskId}")]
        public async Task<IActionResult> DeleteTaskById(int taskId)
        {
            try
            {
                var isDeleted = await _singleTaskService.DeleteSingleTaskByIdAsync(taskId);
                if (!isDeleted)
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
