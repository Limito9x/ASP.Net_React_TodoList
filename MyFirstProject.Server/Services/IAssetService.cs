using MyFirstProject.Server.Dtos;

namespace MyFirstProject.Server.Services
{
    public interface IAssetService
    {
        public Task DeleteAssetAsync(string assetId);
        public Task<AssetResponseDto> UploadAssetAsync(IFormFile file, int planId, int? taskId);
        public Task<List<AssetResponseDto>> UploadAssetsAsync(UploadAssetDto uploadAssetDto);
        public Task<List<AssetResponseDto>?> GetAssetsAsync(int planId, int userId);
    }
}
