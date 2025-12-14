using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Models.Enums;

namespace MyFirstProject.Server.Services
{
    public interface ICloudinaryService
    {
        public Task<CloudinaryResult> UploadFileAsync(IFormFile file);
        public Task DeleteFileAsync(string publicId, FileType fileType);
    }
}
