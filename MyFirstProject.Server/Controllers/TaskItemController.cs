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
        public async Task<ActionResult<TaskItemResponseDto>> CreateTask([FromBody] TaskItemDto taskItemDto)
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

        [HttpGet("categories/{categoryId}")]
        public async Task<ActionResult<List<TaskItemResponseDto>>> GetTasksByCategoryId(int categoryId)
        {
            try
            {
                var taskItems = await _taskItemSerivce.GetTaskItemsByCategoryIdAsync(categoryId);
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
                var taskItem = await _taskItemSerivce.GetTaskItemByIdAsync(taskItemId);
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
        public async Task<ActionResult<TaskItemResponseDto>> UpdateTaskById(int taskId, [FromBody] TaskItemDto taskItemDto)
        {
            try
            {
                var updatedTaskItem = await _taskItemSerivce.UpdateTaskItemByIdAsync(taskId, taskItemDto);
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
                var isDeleted = await _taskItemSerivce.DeleteTaskItemByIdAsync(taskId);
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
