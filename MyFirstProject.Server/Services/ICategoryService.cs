using MyFirstProject.Server.Dtos;

namespace MyFirstProject.Server.Services
{
    public interface ICategoryService
    {
        Task<CategoryResponseDto> CreateCategoryAsync(CategoryDto categoryDto, int userId);
        Task<List<CategoryResponseDto>> GetCategoriesByUserIdAsync(int userId);
        Task<CategoryResponseDto?> GetCategoryByIdAsync(int categoryId);
    }
}
