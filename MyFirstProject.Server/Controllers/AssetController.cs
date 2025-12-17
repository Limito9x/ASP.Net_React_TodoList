using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Services.Asset;
using System.Security.Claims;

namespace MyFirstProject.Server.Controllers
{
    [ApiController]
    [Route("api/assets")]
    [Authorize]
    public class AssetController : ControllerBase
    {
        private readonly IAssetService _assetService;
        public AssetController(IAssetService assetService)
        {
            _assetService = assetService;
        }

        [HttpGet]
        public async Task<ActionResult<List<AssetResponseDto>>> GetAssets([FromQuery] int planId, [FromQuery] int? taskId)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var assets = await _assetService.GetAssetsAsync(planId, userId, taskId);
                return Ok(assets);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<List<AssetResponseDto>>> UploadAssets([FromForm] UploadAssetDto uploadAssetDto)
        {
            try
            {
                var uploadedAssets = await _assetService.UploadAssetsAsync(uploadAssetDto);
                return Ok(uploadedAssets);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{assetId}")]
        public async Task<ActionResult> DeleteAsset(string assetId)
        {
            try
            {
                await _assetService.DeleteAssetAsync(assetId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
