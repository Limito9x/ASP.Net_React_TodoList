using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Services;
using System.Security.Claims;

namespace MyFirstProject.Server.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    [Authorize]
    public class TaskItemController: ControllerBase
    {
        private readonly ITaskItemSerivce _taskItemSerivce;

        public TaskItemController(ITaskItemSerivce taskItemSerivce)
        {
            _taskItemSerivce = taskItemSerivce;
        }

        [HttpPost]
        public async Task<ActionResult<TaskItemResponseDto>> CreateTask([FromBody] CreateTaskItemDto taskItemDto)
        {
            try
            {
                var createdTaskItem = await _taskItemSerivce.CreateTaskItemAsync(taskItemDto);
                return Ok(createdTaskItem);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("plans/{planId}")]
        public async Task<ActionResult<List<TaskItemResponseDto>>> GetTasksByPlanId(int planId)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var taskItems = await _taskItemSerivce.GetTaskItemsByPlanIdAsync(planId, userId);  
                return Ok(taskItems);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{taskItemId}")]
        public async Task<ActionResult<TaskItemResponseDto>> GetTaskById(int taskItemId)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var taskItem = await _taskItemSerivce.GetTaskItemByIdAsync(taskItemId, userId);
                if (taskItem == null)
                {
                    return NotFound();
                }
                return Ok(taskItem);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{taskId}")]
        public async Task<ActionResult<TaskItemResponseDto>> UpdateTaskById(int taskId, [FromBody] UpdateTaskItemDto taskItemDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var updatedTaskItem = await _taskItemSerivce.UpdateTaskItemByIdAsync(taskId, taskItemDto, userId);
                if (updatedTaskItem == null)
                {
                    return NotFound();
                }
                return Ok(updatedTaskItem);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{taskId}")]
        public async Task<ActionResult> DeleteTaskById(int taskId)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var isDeleted = await _taskItemSerivce.DeleteTaskItemByIdAsync(taskId, userId);
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
