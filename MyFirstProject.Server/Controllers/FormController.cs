using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Services.Form;

namespace MyFirstProject.Server.Controllers
{
    [ApiController]
    [Route("api/forms")]
    [Authorize]
    public class FormController: ControllerBase
    {
        private readonly IFormService _formService;
        public FormController(IFormService formService)
        {
            _formService = formService;
        }

        [HttpGet]
        public async Task<ActionResult<List<ResponseFormDto>>> GetAllForm([FromQuery] RequestQueryFormDto queryDto)
        {
            try
            {
                var forms = await _formService.GetAllFormsAsync(queryDto);
                return Ok(forms);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPost]
        public async Task<ActionResult<ResponseFormDto>> CreateForm([FromBody] RequestFormDto formDto)
        {
            try
            {
                var createdForm = await _formService.CreateFormAsync(formDto);
                return Ok(createdForm);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpDelete("{formId}")]
        public async Task<ActionResult> DeleteForm(int formId)
        {
            try
            {
                var result = await _formService.DeleteFormAsync(formId);
                if (!result)
                {
                    return NotFound();
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}