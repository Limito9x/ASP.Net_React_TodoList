using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Mappers
{
    public static class AssetMapper
    {
        public static AssetResponseDto ToDto(this Asset asset)
        {
            return new AssetResponseDto
            {
                Id = asset.Id,
                FileName = asset.FileName,
                Url = asset.Url,
                PublicId = asset.PublicId,
                Type = asset.Type,
                CreatedAt = asset.CreatedAt,
                TaskId = asset.TaskId,
            };
        }

        public static List<AssetResponseDto> ToDtoList(this IEnumerable<Asset> assets)
        {
            return assets.Select(a => a.ToDto()).ToList();
        }
    }
}
