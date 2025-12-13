using MyFirstProject.Server.Dtos;

namespace MyFirstProject.Server.Services
{
    public interface ICloudinaryService
    {
        public Task<CloudinaryResult> UploadFileAsync(IFormFile file);
        public Task DeleteFileAsync(string publicId);
    }
}
