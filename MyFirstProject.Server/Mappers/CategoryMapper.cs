using MyFirstProject.Server.Models;
using MyFirstProject.Server.Dtos;

namespace MyFirstProject.Server.Mappers
{
    public static class CategoryMapper
    {
        public static CategoryResponseDto ToDto(this Category category)
        {
            return new CategoryResponseDto
            {
                Id = category.Id,
                Name =  category.Name,
                Description = category.Description,
                UserId = category.UserId
            };
        }
        public static Category ToModel(this CategoryDto addCategoryDto, int userId)
        {
            return new Category
            {
                Name = addCategoryDto.Name,
                Description = addCategoryDto.Description,
                UserId = userId
            };
        }
    }
}
