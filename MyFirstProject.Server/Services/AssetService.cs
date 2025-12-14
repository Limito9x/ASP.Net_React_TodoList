using Microsoft.EntityFrameworkCore;
using MyFirstProject.Server.Data;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Helpers;
using MyFirstProject.Server.Mappers;
using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Services
{
    public class AssetService: IAssetService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICloudinaryService _cloudinaryService;

        public AssetService(ICloudinaryService cloudinaryService, ApplicationDbContext context)
        {
            _cloudinaryService = cloudinaryService;
           _context = context;
        }

        public async Task DeleteAssetAsync(string assetId)
        {
            var asset = await _context.Assets.FindAsync(int.Parse(assetId)) ??
                throw new Exception("Asset not found");

            await _cloudinaryService.DeleteFileAsync(asset.PublicId, asset.Type);

            _context.Assets.Remove(asset);
            await _context.SaveChangesAsync();

        }
        public async Task<AssetResponseDto> UploadAssetAsync(IFormFile file, int planId, int? taskId)
        {
            var cloudResult =  _cloudinaryService.UploadFileAsync(file);

            var asset = new Asset
            {
                FileName = file.FileName,
                PublicId = cloudResult.Result.PublicId,
                Url = cloudResult.Result.Url,
                Extension = Path.GetExtension(file.FileName),
                FileSize = file.Length,
                Type = FileHelper.GetFileType(file.FileName),
                CreatedAt = DateTime.UtcNow,
                PlanId = planId,
                TaskId = taskId
            };

            _context.Assets.Add(asset);
            await _context.SaveChangesAsync();
            return asset.ToDto();
        }
        public async Task<List<AssetResponseDto>> UploadAssetsAsync(UploadAssetDto assetDto)
        {
            var files = assetDto.Files;
            var planId = assetDto.PlanId;
            var taskId = assetDto.TaskId ?? null;
            if(taskId!=null)
            {
                var taskExists = await _context.TaskItems.AnyAsync(t => t.Id == taskId && t.PlanId == planId);
                if (!taskExists)
                {
                    throw new Exception("Task does not exist in the specified plan.");
                }
            }
            var uploadTasks = files.Select(file => UploadAssetAsync(file, planId, taskId));
            var assetDtos = await Task.WhenAll(uploadTasks);
            var assetDtoList = assetDtos.ToList();
            return assetDtoList;
        }
        public async Task<List<AssetResponseDto>?> GetAssetsAsync(int planId, int userId)
        {
            return await _context.Assets
                .Include(a => a.Plan)
                .Where(a => a.PlanId == planId && a.Plan.UserId == userId)
                .Select(a => a.ToDto())
                .ToListAsync();
        }
    }
}
