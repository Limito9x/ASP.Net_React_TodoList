using Microsoft.EntityFrameworkCore;
using MyFirstProject.Server.Data;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Mappers;

namespace MyFirstProject.Server.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ApplicationDbContext _context;

        public CategoryService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<CategoryResponseDto> CreateCategoryAsync(CategoryDto categoryDto, int userId)
        {
            // B1. Mapper DTO sang Model
            var category = categoryDto.ToModel(userId);
            // B2. Thêm vào CSDL
            await _context.Categories.AddAsync(category);
            // B3. Lưu thay đổi
            await _context.SaveChangesAsync();
            // B4. Trả về DTO
            return category.ToDto();
        }

        public async Task<CategoryResponseDto?> GetCategoryByIdAsync(int categoryId)
        {
            var category = await _context.Categories.FindAsync(categoryId);

            return category?.ToDto();
        }

        public async Task<List<CategoryResponseDto>> GetCategoriesByUserIdAsync(int userId)
        {
            var categories = await _context.Categories
                .Where(c => c.UserId == userId)
                .Select(c => c.ToDto())
                .ToListAsync();

            return categories;
        }

        public async Task<CategoryDto> UpdateCategoryAsync(int categoryId, CategoryDto categoryDto)
        {
            var category = await _context.Categories.FindAsync(categoryId);
            if (category == null)
            {
                throw new KeyNotFoundException("Category not found");
            }
            // Cập nhật các thuộc tính
            category.Name = categoryDto.Name;
            category.Description = categoryDto.Description;
            // Lưu thay đổi
            await _context.SaveChangesAsync();
            return categoryDto;
        }

        public async Task<bool> DeleteCategoryAsync(int categoryId)
        {
            var category = await _context.Categories.FindAsync(categoryId);
            if (category == null)
            {
                return false;
            }
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
