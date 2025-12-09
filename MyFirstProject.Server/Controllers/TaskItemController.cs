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
        public async Task<ActionResult<TaskItemDto>> CreateTask([FromBody] TaskItemDto taskItemDto)
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

        [HttpGet("category/{categoryId}")]
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
    }
}
