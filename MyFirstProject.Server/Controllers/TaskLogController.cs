using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Services.TaskLog;

namespace MyFirstProject.Server.Controllers
{
    [ApiController]
    [Route("api/task-logs")]
    [Authorize]
    public class TaskLogController : ControllerBase
    {
        private readonly ITaskLogService _taskLogService;
        public TaskLogController(ITaskLogService taskLogService)
        {
            _taskLogService = taskLogService;
        }

        [HttpGet("{taskLogId}")]
        public async Task<ActionResult<TaskLogDto>> GetTaskLogById(int taskLogId)
        {
            try
            {
                var taskLog = await _taskLogService.GetTaskLogByIdAsync(taskLogId);
                if (taskLog == null)
                {
                    return NotFound();
                }
                return Ok(taskLog);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<TaskLogDto>> CreateTaskLog([FromBody] RequestTaskLogDto taskLogDto)
        {
            try
            {
                var createdTaskLog = await _taskLogService.CreateTaskLogAsync(taskLogDto);
                return Ok(createdTaskLog);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{taskLogId}")]
        public async Task<ActionResult<TaskLogDto>> UpdateTaskLog(int taskLogId, [FromBody] RequestTaskLogDto taskLogDto)
        {
            try
            {
                var updatedTaskLog = await _taskLogService.UpdateTaskLogAsync(taskLogId, taskLogDto);
                if (updatedTaskLog == null)
                {
                    return NotFound();
                }
                return Ok(updatedTaskLog);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{taskLogId}")]
        public async Task<IActionResult> DeleteTaskLog(int taskLogId)
        {
            try
            {
                var result = await _taskLogService.DeleteTaskLogAsync(taskLogId);
                if (!result)
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